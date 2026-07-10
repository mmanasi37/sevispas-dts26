'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, Home, Plus, User2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Fragment } from "react/jsx-runtime";

const projects: any[] = [{
    name: "Project 1",
    url: "string",
    icon: "string"
}]

export function AppSidebar() {
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar();

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <SidebarMenuButton>
                                    Select Workspace
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
                {/* <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <a href="#">
                                <Home />
                                <span>Home</span>
                            </a>
                        </SidebarMenuButton>
                        <SidebarMenuAction>
                            <Plus /> <span className="sr-only">Add Project</span>
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu> */}
                <SidebarMenu>
                    {projects.map((project) => (
                        <SidebarMenuItem key={project.name}>
                            <SidebarMenuButton>
                                <a href={project.url}>
                                    <project.icon />
                                    <span>{project.name}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus /> <span className="sr-only">Add Project</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent></SidebarGroupContent>
                </SidebarGroup>
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <CollapsibleTrigger>
                                Help
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent />
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
            
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User2 /> Username
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    )
}

