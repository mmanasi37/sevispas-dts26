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
import { ChartBarIcon, ChevronDownIcon, CoinsIcon, HomeIcon, LayoutDashboardIcon, NotebookTextIcon, PlusIcon, User2Icon, UsersIcon } from "lucide-react";
import Link from "next/link";
import useUser from "@/hooks/use-user";

interface MenuAction {
    name: string;
    url: string;
    icon: any;
}
interface MenuItem {
    name: string;
    url: string;
    icon: any;
    action: MenuAction;
}

interface Menu {
    name: string;
    url: string;
    icon: any;
    items?: MenuItem[];
}

const menus: Menu[] = [
    {
        name: "Home",
        url: "/staff",
        icon: HomeIcon,
        items: [
            {
                name: "Project 1",
                url: "string",
                icon: "string",
                action: {
                    name: "Add Project",
                    url: "string",
                    icon: "string"
                }
            }
        ]
    },
    {
        name: "Dashboard",
        url: "/staff/dashboard",
        icon: LayoutDashboardIcon,
        items: [
            {
                name: "Project 1",
                url: "string",
                icon: "string",
                action: {
                    name: "Add Project",
                    url: "string",
                    icon: "string"
                }
            }
        ]
    },
    {
        name: "Loan Applications",
        url: "/staff/applications",
        icon: NotebookTextIcon,
        items: [
            {
                name: "All Applications",
                url: "/staff/applications",
                icon: "string",
                action: {
                    name: "Add Application",
                    url: "/staff/applications/create",
                    icon: "string"
                }
            },
            {
                name: "Pending Reviews",
                url: "/staff/applications/pending",
                icon: "string",
                action: {
                    name: "Add Application",
                    url: "/staff/applications/create",
                    icon: "string"
                }
            },
            {
                name: "Reviews",
                url: "/staff/review",
                icon: "string",
                action: {
                    name: "All Reviews",
                    url: "/staff/reviews",
                    icon: "string",
                }
            }
        ]
    },
    {
        name: "Borrowers",
        url: "/staff/borrowers",
        icon: UsersIcon,
    },
    {
        name: "Repayments",
        url: "/staff/repayments",
        icon: CoinsIcon,
    },
    {
        name: "Reports",
        url: "/staff/reports",
        icon: ChartBarIcon,
        items: [
            {
                name: "All Reports",
                url: "/staff/reports",
                icon: "string",
                action: {
                    name: "Add Report",
                    url: "/staff/reports/create",
                    icon: "string"
                }
            }
        ]
    }
];

export function AppSidebar() {
    const { user } = useUser();

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
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {menus.map((menu) => (
                        <SidebarMenuItem key={menu.name}>
                            <SidebarMenuButton>
                                <a href={menu.url}>
                                    <menu.icon />
                                    <span>{menu.name}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                {/* <SidebarGroup>
                    <SidebarGroupLabel>Applications</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus /> <span className="sr-only">Add Application</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Link href="#">
                                    <Home />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuAction>
                                <Plus /> <span className="sr-only">Add Project</span>
                            </SidebarMenuAction>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User2Icon /> {user?.name}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    )
}

