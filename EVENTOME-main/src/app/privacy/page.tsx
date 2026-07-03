
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="container py-12 md:py-24">
             <Button variant="ghost" asChild className="mb-8">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
            </Button>
            <Card className="bg-card/60 backdrop-blur-sm border-white/10 max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Privacy Policy</CardTitle>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, create or join an event, and communicate with us. This may include your name, email address, and profile picture.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">2. How We Use Your Information</h2>
                        <p>We use the information we collect to operate, maintain, and provide you with the features and functionality of the service. This includes personalizing your experience, communicating with you, and processing transactions.</p>
                    </section>
                     <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">3. How We Share Your Information</h2>
                        <p>We do not sell or rent your personal information to third parties. We may share your information with event organizers if you join their event, or with service providers who perform services on our behalf, under confidentiality agreements.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">4. Data Security</h2>
                        <p>We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no security system is impenetrable, and we cannot guarantee the security of our systems.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">5. Your Choices</h2>
                        <p>You may update or correct your account information at any time by accessing your profile settings. You may also unsubscribe from promotional email communications from us by following the instructions in those emails.</p>
                    </section>
                     <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">6. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}
