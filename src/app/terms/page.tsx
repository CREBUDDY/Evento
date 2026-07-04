
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
    return (
        <div className="container py-12 md:py-24 bg-brutalBg min-h-screen">
             <Button variant="outline" asChild className="mb-8 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
                    Back to Login
                </Link>
            </Button>
            <Card className="bg-white border-4 border-black max-w-4xl mx-auto rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="border-b-4 border-black bg-brutalYellow">
                    <CardTitle className="font-headline text-3xl font-black tracking-tighter sm:text-4xl text-black uppercase">Terms of Service</CardTitle>
                    <p className="text-black font-bold border-l-4 border-black pl-2">Last updated: {new Date().toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="space-y-6 text-black font-medium leading-relaxed p-6">
                    <section className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">1. Introduction</h2>
                        <p className="mt-2">Welcome to Evento! These Terms of Service ("Terms") govern your use of our platform. By accessing or using our services, you agree to be bound by these Terms.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalBlue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">2. User Accounts</h2>
                        <p className="mt-2">To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalGreen shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">3. User Conduct</h2>
                        <p className="mt-2">You agree not to use the service for any unlawful purpose or to engage in any conduct that could damage, disable, or impair our platform. You are solely responsible for the content you post and the events you create.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalYellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">4. Event Creation and Attendance</h2>
                        <p className="mt-2">Organizers are responsible for the accuracy of their event listings. Attendees agree to abide by the rules set forth by the event organizers. Evento is a platform provider and is not responsible for the execution or quality of the events themselves.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">5. Limitation of Liability</h2>
                        <p className="mt-2">Evento shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
                    </section>
                     <section className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">6. Changes to Terms</h2>
                        <p className="mt-2">We reserve the right to modify these terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}
