
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventCard from "@/components/event-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { cn } from "@/lib/utils";
import { Event, EventAudience, EventCategory, EventStatus } from "@/types";
import { updateEvent } from "@/actions/events";
import LoaderBox from "@/components/loader-box";

const categories: EventCategory[] = ['Cultural', 'Hackathon', 'Party', 'Tech', 'Sports', 'Workshop', 'AI', 'Gaming', 'Other'];
const audiences: EventAudience[] = ['College', 'Society', 'Organization', 'Public'];

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  category: z.enum(categories),
  targetAudience: z.enum(audiences),
  dateTime: z.date(),
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please use HH:mm format."),
  venue: z.string().min(3, "Venue is required."),
  venueAddress: z.string().min(10, "Venue address must be at least 10 characters long."),
  capacity: z.coerce.number().int().positive("Capacity must be a positive number."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  imageUrl: z.string().url("Please enter a valid URL."),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

type EditClientProps = {
  initialEvent: Event;
};

export default function EditClient({ initialEvent }: EditClientProps) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewEvent, setPreviewEvent] = useState<Event | null>(null);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: initialEvent.title,
            description: initialEvent.description,
            category: initialEvent.category as EventCategory,
            targetAudience: initialEvent.targetAudience as EventAudience,
            venue: initialEvent.venue,
            venueAddress: initialEvent.venueAddress,
            imageUrl: initialEvent.imageUrl || "",
            capacity: initialEvent.capacity,
            price: initialEvent.price,
            dateTime: new Date(initialEvent.dateTime),
            eventTime: new Date(initialEvent.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        },
    });

    useEffect(() => {
        if (!isUserLoading && !user) {
            const redirect = searchParams.get('redirect');
            router.push(redirect ? `/login?redirect=${redirect}` : '/login?redirect=/creato');
        }
    }, [user, isUserLoading, router, searchParams]);
    
    const handlePreview = () => {
        const values = form.getValues();
        const [hours, minutes] = values.eventTime.split(':').map(Number);
        const combinedDateTime = new Date(values.dateTime);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        setPreviewEvent({
            id: 'preview-id',
            title: values.title,
            description: values.description,
            category: values.category,
            dateTime: combinedDateTime.toISOString(),
            venue: values.venue,
            venueAddress: values.venueAddress,
            capacity: values.capacity,
            price: values.price,
            targetAudience: values.targetAudience,
            imageUrl: values.imageUrl,
            organizerId: user?.id || 'preview-organizer',
            organizerName: user?.user_metadata?.name || user?.email || 'Your Name',
            organizerImage: user?.user_metadata?.avatar_url || '',
            status: 'draft',
            attendees: 0,
        });
    };

    async function handleFormSubmit(values: EventFormValues, status: EventStatus) {
        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to create an event.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        const [hours, minutes] = values.eventTime.split(':').map(Number);
        const combinedDateTime = new Date(values.dateTime);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        const eventPayload = {
            ...values,
            dateTime: combinedDateTime.toISOString(),
            organizerId: user.id, // Using user.id from Supabase
            status,
        };

        try {
            const updatedEvent = await updateEvent(initialEvent.id, eventPayload);
            toast({
                title: `Event ${status === 'published' ? 'Updated' : 'Saved as Draft'}!`,
                description: `${values.title} is now ${status === 'published' ? 'live' : 'saved in your drafts'}.`,
            });
            if (status === 'published') {
                router.push(`/events/${updatedEvent.id}`);
            } else {
                router.push('/dashboard/organizer/drafts');
            }
        } catch (error) {
            console.error("Error updating event: ", error);
            toast({
                title: "Error",
                description: "Failed to update event. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isUserLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-brutalBg">
                <LoaderBox />
            </div>
        );
    }
  
    return (
        <div className="container py-12 md:py-24 bg-brutalBg relative overflow-hidden min-h-screen">
            {/* Wireframe Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{
                   backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                   backgroundSize: '40px 40px'
                 }}>
            </div>
            
            <div className="relative z-10 mx-auto max-w-3xl">
                <Button variant="outline" asChild className="mb-8 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
                        Back to Events
                    </Link>
                </Button>
                
                <div className="space-y-2 text-center mb-12 border-l-8 border-brutalPurple pl-6 text-left bg-white p-6 border-4 border-black shadow-brutal">
                    <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl text-black">Edit Your Event</h1>
                    <p className="text-black font-bold text-lg border-l-4 border-black pl-4">Update the details below. Changes will be saved immediately.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => handleFormSubmit(values, 'published'))} className="space-y-8 bg-white border-4 border-black p-8 shadow-brutal">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="font-black uppercase text-black">Event Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Nexus Hackathon 2025" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="font-black uppercase text-black">Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us more about your event..." {...field} className="rounded-none border-4 border-black bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black min-h-[120px]" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-black uppercase text-black">Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-none border-4 border-black h-14 bg-brutalBg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black uppercase">
                                        <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="targetAudience"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-black uppercase text-black">Target Audience</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-none border-4 border-black h-14 bg-brutalBg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black uppercase">
                                        <SelectValue placeholder="Select target audience" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        {audiences.map(aud => <SelectItem key={aud} value={aud}>{aud}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        
                         <FormField
                            control={form.control}
                            name="dateTime"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel className="font-black uppercase text-black">Date & Time</FormLabel>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-bold rounded-none border-4 border-black h-14 bg-brutalBg hover:bg-brutalBg hover:text-black focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={3} />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormField
                                        control={form.control}
                                        name="eventTime"
                                        render={({ field }) => (
                                            <FormItem className="m-0">
                                                <FormControl>
                                                    <Input type="time" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black uppercase" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <FormField
                                control={form.control}
                                name="venue"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="font-black uppercase text-black">Venue</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Main Auditorium" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="venueAddress"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="font-black uppercase text-black">Venue Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 123 Tech Park, Silicon Valley" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="font-black uppercase text-black">Capacity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 200" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                           <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="font-black uppercase text-black">Entry Fee (₹)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter 0 for free events" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-black uppercase text-black">Event Banner URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/banner.jpg" {...field} className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black" />
                                </FormControl>
                                <FormDescription className="font-bold border-l-4 border-black pl-2">
                                    Link to the official banner or poster for your event.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t-4 border-black">
                             <Button type="button" variant="outline" onClick={() => handleFormSubmit(form.getValues(), 'draft')} disabled={isSubmitting} className="rounded-none border-4 border-black h-14 px-8 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                                Save as Draft
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="outline" size="icon" onClick={handlePreview} disabled={isSubmitting} className="rounded-none border-4 border-black h-14 w-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all hidden sm:flex">
                                        <Eye className="h-6 w-6" strokeWidth={3} />
                                        <span className="sr-only">Preview</span>
                                    </Button>
                                </DialogTrigger>
                                {previewEvent && (
                                    <DialogContent className="max-w-md w-full">
                                        <DialogHeader>
                                            <DialogTitle>Event Preview</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            <EventCard event={previewEvent} />
                                        </div>
                                    </DialogContent>
                                )}
                            </Dialog>

                            <Button type="submit" disabled={isSubmitting} className="rounded-none border-4 border-black h-14 px-8 bg-brutalGreen text-black font-black uppercase hover:bg-brutalGreen shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                                {isSubmitting ? "Updating..." : "Update Event"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
