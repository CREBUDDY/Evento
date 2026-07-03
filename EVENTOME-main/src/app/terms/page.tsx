
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
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
                    <CardTitle className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Terms of Service</CardTitle>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">1. Introduction</h2>
                        <p>Welcome to Evento! These Terms of Service ("Terms") govern your use of our platform. By accessing or using our services, you agree to be bound by these Terms.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">2. User Accounts</h2>
                        <p>To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">3. User Conduct</h2>
                        <p>You agree not to use the service for any unlawful purpose or to engage in any conduct that could damage, disable, or impair our platform. You are solely responsible for the content you post and the events you create.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">4. Event Creation and Attendance</h2>
                        <p>Organizers are responsible for the accuracy of their event listings. Attendees agree to abide by the rules set forth by the event organizers. Evento is a platform provider and is not responsible for the execution or quality of the events themselves.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">5. Limitation of Liability</h2>
                        <p>Evento shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
                    </section>
                     <section>
                        <h2 className="text-xl font-bold text-foreground mb-2">6. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}
