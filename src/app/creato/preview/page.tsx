"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { addDoc, collection, serverTimestamp } from "@/firebase";

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

export default function CreatoPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewEvent, setPreviewEvent] = useState<Event | null>(null);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: "",
            description: "",
            venue: "",
            venueAddress: "",
            imageUrl: "",
            capacity: 100,
            price: 0,
            dateTime: new Date(),
            eventTime: "18:00",
        },
    });

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login?redirect=/creato');
        }
    }, [user, isUserLoading, router]);
    
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
            organizerId: user?.uid || 'preview-organizer',
            organizerName: user?.displayName || 'Your Name',
            organizerImage: user?.photoURL || '',
            status: 'draft',
            attendees: 0,
        });
    };

    async function handleFormSubmit(values: EventFormValues, status: EventStatus) {
        if (!user || !firestore) {
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
            organizerId: user.uid,
            organizerName: user.displayName,
            organizerImage: user.photoURL,
            status,
            createdAt: serverTimestamp(),
            attendees: 0,
        };
        delete (eventPayload as Partial<EventFormValues>).eventTime;

        const eventsCollection = collection(firestore, 'creato');
        
        try {
            const docRef = await addDoc(eventsCollection, eventPayload);
            toast({
                title: `Event ${status === 'published' ? 'Published' : 'Saved as Draft'}!`,
                description: `${values.title} is now ${status === 'published' ? 'live' : 'saved in your drafts'}.`,
            });
            if (status === 'published') {
                router.push(`/events/${docRef.id}`);
            } else {
                router.push('/dashboard/organizer/drafts');
            }
        } catch (error) {
            console.error("Error creating event: ", error);
            const permissionError = new FirestorePermissionError({
              path: eventsCollection.path,
              operation: 'create',
              requestResourceData: eventPayload,
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isUserLoading || !user) {
        return (
            <div className="container py-12 md:py-24">
                <p>Loading...</p>
            </div>
        )
    }
  
    return (
        <div className="container py-12 md:py-24">
            <Button variant="ghost" asChild className="mb-8">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                </Link>
            </Button>
            <div className="mx-auto max-w-3xl">
                <div className="space-y-2 text-center mb-12">
                    <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Create Your Next Event</h1>
                    <p className="text-muted-foreground">Fill in the details below to get started. You can publish right away.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => handleFormSubmit(values, 'published'))} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Nexus Hackathon 2025" {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us more about your event..." {...field} />
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
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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
                                    <FormLabel>Target Audience</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select target audience" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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
                                <FormLabel>Date & Time</FormLabel>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
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
                                                    <Input type="time" {...field} />
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
                                    <FormLabel>Venue</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Main Auditorium" {...field} />
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
                                    <FormLabel>Venue Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 123 Tech Park, Silicon Valley" {...field} />
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
                                    <FormLabel>Capacity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 200" {...field} />
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
                                    <FormLabel>Entry Fee (₹)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter 0 for free events" {...field} />
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
                                <FormLabel>Event Banner URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/banner.jpg" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Link to the official banner or poster for your event.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                             <Button type="button" variant="outline" onClick={() => handleFormSubmit(form.getValues(), 'draft')} disabled={isSubmitting}>
                                Save as Draft
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="outline" size="icon" onClick={handlePreview} disabled={isSubmitting}>
                                        <Eye className="h-4 w-4" />
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

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Publishing..." : "Publish Event"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
