import Link from "next/link";
import { Download, Mail, Github, Linkedin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "../../../site.config";
import { BackgroundTitle } from "@/components/background-title";

const skills = {
  "Networking & Security": [
    "OPNsense/pfSense",
    "WireGuard/OpenVPN",
    "VLAN Design",
    "Firewall Management",
    "Network Monitoring",
    "Intrusion Detection"
  ],
  "Systems & Virtualization": [
    "Proxmox VE",
    "VMware vSphere",
    "Docker/Podman",
    "Kubernetes",
    "Linux Administration",
    "Windows Server"
  ],
  "Automation & DevOps": [
    "Ansible",
    "Terraform",
    "CI/CD Pipelines",
    "Infrastructure as Code",
    "Monitoring Stack",
    "Backup Solutions"
  ],
  "Development": [
    "Python",
    "Bash/PowerShell",
    "JavaScript/TypeScript",
    "React/Next.js",
    "API Development",
    "Database Management"
  ],
  "Creative": [
    "Digital Illustration",
    "3D Modeling",
    "Photography",
    "UI/UX Design",
    "Adobe Creative Suite",
    "Blender"
  ]
};

const timeline = [
  {
    year: "2025/09-Present",
    title: "Operation Assistant",
    company: "Uni Express Inc.",
    description: "Managing enterprise network infrastructure, implementing security policies, and automating routine tasks."
  },
  {
    year: "2025/04-2025/08",
    title: "Quality Assurance",
    company: "JFS Fulfillments Inc.",
    description: "Assisted in network design and implementation, managed virtualized environments, and provided technical support."
  },
  {
    year: "2024/06-2025/01",
    title: "Marketing Specialist",
    company: "abc Funding Inc.",
    description: "Provided technical support, maintained computer systems, and helped with network troubleshooting."
  },
  {
    year: "2024/07-2024/08",
    title: "Web Developer(Project base)",
    company: "abc Funding Inc.",
    description: "Focused on network security, system administration, and software development fundamentals."
  }
];

export default function AboutPage() {
  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            IT professional passionate about network security, infrastructure automation, 
            and creative problem-solving through technology.
          </p>
        </section>

        {/* Bio */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                I&apos;m a dedicated IT professional with a strong focus on network security and infrastructure management.
                My journey in technology began with a curiosity about how systems work together, which evolved into
                a passion for building secure, efficient, and scalable solutions.
              </p>
              <p>
                Currently working as an IT Support Specialist, I specialize in network design, virtualization, 
                and security implementation. I enjoy the challenge of troubleshooting complex issues and finding 
                innovative solutions that improve both security and user experience.
              </p>
              <p>
                Beyond my technical work, I&apos;m also passionate about digital art and photography, which helps me
                approach problems with creativity and attention to detail. I believe that the intersection of 
                technology and creativity leads to the most innovative solutions.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">Experience</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="outline">{item.year}</Badge>
                  </div>
                  <CardDescription className="text-base font-medium">
                    {item.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Currently Learning */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Currently Learning</CardTitle>
              <CardDescription>
                I&apos;m always expanding my knowledge and staying current with technology trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {site.currentlyLearning.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact & Resume */}
        <section className="text-center">
          <Card>
            <CardHeader>
              <CardTitle>Let&apos;s Connect</CardTitle>
              <CardDescription>
                Interested in collaborating or discussing technology? I&apos;d love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild>
                  <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={site.social.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`mailto:${site.social.email}`}>
                      <Mail className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      </div>
    </div>
  );
}
