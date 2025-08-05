'use client';

import React from "react";
import {
  IconHome,
  IconBriefcase,
  IconStar,
  IconBulb,
  IconLayoutGrid,
  IconSchool,
  IconMail,
} from "@tabler/icons-react";
import { FloatingDock } from "./floating_menu";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-white" />,
      href: "#home",
    },
    {
      title: "Experience",
      icon: <IconBriefcase className="h-full w-full text-white" />,
      href: "#experience",
    },
    {
      title: "Skills",
      icon: <IconStar className="h-full w-full text-white" />,
      href: "#skills",
    },
    {
      title: "Philosophy",
      icon: <IconBulb className="h-full w-full text-white" />,
      href: "#Philosophy",
    },
    {
      title: "Projects",
      icon: <IconLayoutGrid className="h-full w-full text-white" />,
      href: "#projects",
    },
    {
      title: "Education",
      icon: <IconSchool className="h-full w-full text-white" />,
      href: "#education",
    },
    {
      title: "Contact Me",
      icon: <IconMail className="h-full w-full text-white" />,
      href: "#contact",
    },
  ];

  return (
    <div className="flex items-center fixed bottom-10 justify-center z-50 w-full">
      <FloatingDock
        items={links}
        mobileClassName="translate-y-20"
      />
    </div>
  );
}
