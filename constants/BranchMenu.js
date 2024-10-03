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
        icon: CheckSquare ,
        submenu: [
            { name: "New Admissions", icon: UserPlus ,href:"/branch/underdevelopment"},
            { name: "Branch Visits", icon: User ,href:"/branch/underdevelopment"},
            { name: "Enrolled Students", icon: CheckSquare ,href:"/branch/underdevelopment"},
            { name: "Student Interaction History", icon: Book ,href:"/branch/underdevelopment"},
            { name: "Class Scheduling", icon: Calendar ,href:"/branch/underdevelopment"},
            { name: "Parent-Teacher Communication", icon: MessageSquare ,href:"/branch/underdevelopment"},
            { name: "Student Groups", icon: Users ,href:"/branch/underdevelopment"},
            { name: "Behavior Reports", icon: AlertTriangle ,href:"/branch/underdevelopment"},
            { name: "Health Records", icon: FileText ,href:"/branch/underdevelopment"},
            { name: "Emergency Contacts", icon: Phone ,href:"/branch/underdevelopment"},
        ],
    }, 
    {
        id: "2",
        title: "Branchs",
        icon: MapPinHouse,
        submenu: [
            { name: "All Branch", icon: MapPinHouse,href:"/branch/page/branch" },
            { name: "New Branch", icon: MapPinPlus,href:"/branch/page/addbranch" },
            { name: "Register Staff", icon: ShieldCheck,href:"/branch/page/registerstaff" },
            { name: "Staff", icon: Users,href:"/branch/page/staff" },
            { name: "Branch Reports", icon: Download,href:"/branch/page/branchreport" },
            { name: "Branch Performance", icon: Gauge,href:"/branch/page/performance" }
        ],
    },
    {
        id: "5",
        title: "Communication",
        icon: Mail,
        submenu: [
            { name: "Email Communication", icon: Mail,href:"/branch/underdevelopment" },
        ],
    },
];
