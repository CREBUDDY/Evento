
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="container py-12 md:py-24 bg-brutalBg min-h-screen">
             <Button variant="outline" asChild className="mb-8 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
                    Back to Login
                </Link>
            </Button>
            <Card className="bg-white border-4 border-black max-w-4xl mx-auto rounded-none shadow-[8px_8px_0px_0px_var(--brutal-shadow)]">
                <CardHeader className="border-b-4 border-black bg-brutalGreen">
                    <CardTitle className="font-headline text-3xl font-black tracking-tighter sm:text-4xl text-black uppercase">Privacy Policy</CardTitle>
                    <p className="text-black font-bold border-l-4 border-black pl-2">Last updated: {new Date().toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="space-y-6 text-black font-medium leading-relaxed p-6">
                    <section className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">1. Information We Collect</h2>
                        <p className="mt-2">We collect information you provide directly to us, such as when you create an account, create or join an event, and communicate with us. This may include your name, email address, and profile picture.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalYellow shadow-[4px_4px_0px_0px_var(--brutal-shadow)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">2. How We Use Your Information</h2>
                        <p className="mt-2">We use the information we collect to operate, maintain, and provide you with the features and functionality of the service. This includes personalizing your experience, communicating with you, and processing transactions.</p>
                    </section>
                     <section className="p-4 border-4 border-black bg-brutalBlue shadow-[4px_4px_0px_0px_var(--brutal-shadow)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">3. How We Share Your Information</h2>
                        <p className="mt-2">We do not sell or rent your personal information to third parties. We may share your information with event organizers if you join their event, or with service providers who perform services on our behalf, under confidentiality agreements.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalRed shadow-[4px_4px_0px_0px_var(--brutal-shadow)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">4. Data Security</h2>
                        <p className="mt-2">We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no security system is impenetrable, and we cannot guarantee the security of our systems.</p>
                    </section>
                    <section className="p-4 border-4 border-black bg-brutalBg shadow-[4px_4px_0px_0px_var(--brutal-shadow)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">5. Your Choices</h2>
                        <p className="mt-2">You may update or correct your account information at any time by accessing your profile settings. You may also unsubscribe from promotional email communications from us by following the instructions in those emails.</p>
                    </section>
                     <section className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)]">
                        <h2 className="text-xl font-black text-black mb-2 uppercase border-b-2 border-black inline-block">6. Changes to This Policy</h2>
                        <p className="mt-2">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}
