import {
    UserPlus,
    User,
    CheckSquare,
    Book,
    Calendar,
    MessageSquare,
    Users,
    AlertTriangle,
    FileText,
    Phone,
    MapPinHouse,
    MapPinPlus,
    ShieldCheck,
    Download,
    Mail,
    Gauge,

} from 'lucide-react';

export const Menulist = [
    {
        id: "1",
        title: "Admission",
        icon: CheckSquare,
        submenu: [
            { name: "New Admissions", icon: UserPlus, href: "/staff/underdevelopment" },
            { name: "staff Visits", icon: User, href: "/staff/underdevelopment" },
            { name: "Enrolled Students", icon: CheckSquare, href: "/staff/page/enroll" },
            { name: "Student Interaction History", icon: Book, href: "/staff/underdevelopment" },
            { name: "Class Scheduling", icon: Calendar, href: "/staff/underdevelopment" },
            { name: "Parent-Teacher Communication", icon: MessageSquare, href: "/staff/underdevelopment" },
            { name: "Student Groups", icon: Users, href: "/staff/underdevelopment" },
            { name: "Behavior Reports", icon: AlertTriangle, href: "/staff/underdevelopment" },
            { name: "Health Records", icon: FileText, href: "/staff/underdevelopment" },
            { name: "Emergency Contacts", icon: Phone, href: "/staff/underdevelopment" },
        ],
    },

    // {
    //     id: "2",
    //     title: "Communication",
    //     icon: Mail,
    //     submenu: [
    //         { name: "Email Communication", icon: Mail,href:"/staff/underdevelopment" },
    //     ],
    // },
];
