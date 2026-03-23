import Link from "next/link";
import { Download, Mail, Github, Linkedin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "../../../site.config";
import { BackgroundTitle } from "@/components/background-title";
import { getCMSAbout, StrapiBlock } from "@/lib/cms";
import { TerminalPageHeader } from "@/components/terminal-page-header";

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

function renderBlocks(blocks: StrapiBlock[]) {
  return blocks.map((block, i) => {
    const text = block.children.map(c => c.text).join('');
    if (!text.trim()) return null;
    return <p key={i}>{text}</p>;
  });
}

export const revalidate = 60;

export default async function AboutPage() {
  const about = await getCMSAbout();

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <TerminalPageHeader
          sysLabel={"// ABOUT.SYS"}
          title="About Me"
          subtitle="IT Professional · Security-Minded · Creative Technologist"
        />

        {/* Bio */}
        <section className="mb-16">
          <p className="sys-label mb-2">{"// BIO.TXT"}</p>
          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              {about?.background
                ? renderBlocks(about.background)
                : <p className="text-muted-foreground">No content available.</p>
              }
            </CardContent>
          </Card>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <p className="sys-label mb-2">{"// SKILLS.DAT"}</p>
          <h2 className="mb-8 text-2xl font-semibold">Skills &amp; Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge key={skill} variant="secondary" className="font-mono text-xs">
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
          <p className="sys-label mb-2">{"// WORK.HISTORY"}</p>
          <h2 className="mb-8 text-2xl font-semibold">Experience</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="term-idx">[{(index + 1).toString().padStart(3, '0')}]</span>
                      {item.title}
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">{item.year}</Badge>
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
          <p className="sys-label mb-2">{"// LEARNING.QUEUE"}</p>
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
                  <Badge key={item} variant="outline" className="font-mono text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact & Resume */}
        <section>
          <p className="sys-label mb-2">{"// CONNECT.INIT"}</p>
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
