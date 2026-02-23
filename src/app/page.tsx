import Link from "next/link";
import { ArrowRight, Code, Palette, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "../../site.config";
import { getAllCMSProjects, getAllCMSWorks, getDisplayDate, getCoverUrl } from "@/lib/cms";
import { formatDate } from "@/lib/utils";
import { HeroSection } from "@/components/hero-section";
import { DotField } from "@/components/dot-field";

export const revalidate = 60;

const quickLinks = [
  {
    href: "/projects",
    title: "IT Projects",
    description: "Homelab setups, network security, and automation",
    icon: Code,
  },
  {
    href: "/notes",
    title: "Tech Notes",
    description: "Security research, tutorials, and learning notes",
    icon: FileText,
  },
  {
    href: "/works",
    title: "Creative Works",
    description: "Digital art, UE5 projects, and interactive media",
    icon: Palette,
  },
];

export default async function HomePage() {
  const [projects, works] = await Promise.all([
    getAllCMSProjects(),
    getAllCMSWorks(),
  ]);
  const recentProjects = projects.slice(0, 3);
  const sortedWorks = [...works].sort((a, b) => {
    const aDate = a.PublishDate;
    const bDate = b.PublishDate;
    if (aDate && bDate) return new Date(bDate).getTime() - new Date(aDate).getTime();
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    return 0;
  });
  const recentWorks = sortedWorks.slice(0, 4);

  return (
    <div className="relative">
      {/* Particle field: spans hero + content, fades out at bottom */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '130vh',
          maskImage: 'linear-gradient(to bottom, black 45%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 90%)',
        }}
      >
        <DotField />
      </div>

      <HeroSection name={site.name} taglineDark={site.taglineDark} taglineLight={site.taglineLight} />

      <div className="container mx-auto px-4 py-12 relative z-10">

        {/* Quick Links */}
        <section className="mb-16 animate-fade-in-up">
          <div>
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Explore</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <div key={link.href} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link href={link.href}>
                      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 border border-border">
                        <CardHeader>
                          <IconComponent className="h-8 w-8 text-accent mb-2 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                          <CardTitle className="text-lg font-semibold">{link.title}</CardTitle>
                          <CardDescription className="text-sm">{link.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-16">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
              <Link
                href="/projects"
                className="flex items-center text-accent hover:opacity-80 transition-opacity text-sm font-medium"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.length === 0 ? (
                <p className="text-muted-foreground col-span-3 text-sm">No projects available.</p>
              ) : (
                recentProjects.map((project, index) => (
                  <div key={project.documentId} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link href={`/projects/${project.documentId}`}>
                      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 border border-border">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors">
                            {project.Title}
                          </CardTitle>
                          {getDisplayDate(project) && (
                            <CardDescription className="text-sm">
                              {formatDate(getDisplayDate(project)!)}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.Detail.replace(/```[\s\S]*?```/g, '').replace(/[#*`>\[\]!]/g, '').trim().slice(0, 150)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Featured Works */}
        <section className="mb-16">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Featured Works</h2>
              <Link
                href="/works"
                className="flex items-center text-accent hover:opacity-80 transition-opacity text-sm font-medium"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentWorks.length === 0 ? (
                <p className="text-muted-foreground col-span-2 text-sm">No works available yet.</p>
              ) : (
                recentWorks.map((work, index) => (
                  <div key={work.documentId} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link href={`/works/${work.documentId}`}>
                      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 border border-border overflow-hidden">
                        {work.Cover && work.Cover.mime?.startsWith("image/") && (
                          <div className="overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getCoverUrl(work.Cover)}
                              alt={work.Title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors">
                            {work.Title}
                          </CardTitle>
                          {getDisplayDate(work) && (
                            <CardDescription className="text-sm">
                              {formatDate(getDisplayDate(work)!)}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
