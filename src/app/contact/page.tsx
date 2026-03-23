"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { site } from "../../../site.config";
import { BackgroundTitle } from "@/components/background-title";
import { TerminalPageHeader } from "@/components/terminal-page-header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <TerminalPageHeader
          sysLabel={"// CONTACT.INIT"}
          title="Get In Touch"
          subtitle="Open for collaboration · Response within 48h"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="sys-label text-base">{"// SEND_MSG"}</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-mono uppercase text-xs tracking-wider">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="> Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="font-mono rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-mono uppercase text-xs tracking-wider">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="> your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="font-mono rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-mono uppercase text-xs tracking-wider">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="> Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="font-mono rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-mono uppercase text-xs tracking-wider">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="> Your message..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="font-mono rounded-none"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-mono text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>{"[ MSG.SENT // I'll get back to you soon ]"}</span>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="flex items-start gap-2 text-red-600 dark:text-red-400 font-mono text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>
                        {"[ ERR // message failed — use direct contact ]"}
                      </span>
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full font-mono">
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {"[ SENDING... ]"}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {"[ SEND.MSG ]"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* Contact Info & Social */}
          <section className="space-y-8">
            {/* Direct Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="sys-label text-base">{"// DIRECT.CONTACT"}</CardTitle>
                <CardDescription>
                  Here are other ways to connect.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                    <Link
                      href={`mailto:${site.social.email}`}
                      className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                    >
                      {site.social.email}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="sys-label text-base">{"// SOCIAL.LINKS"}</CardTitle>
                <CardDescription>
                  Connect with me on these platforms to see more of my work.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">GitHub</p>
                    <Link
                      href={site.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                    >
                      View my repositories and contributions
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">LinkedIn</p>
                    <Link
                      href={site.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                    >
                      Professional profile and network
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
