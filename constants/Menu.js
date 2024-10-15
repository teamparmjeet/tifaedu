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
            { name: "Our Courses", icon: Book ,href:"/main/page/courses"},
            { name: "New Admissions", icon: UserPlus ,href:"/main/underdevelopment"},
            { name: "Branch Visits", icon: User ,href:"/main/underdevelopment"},
            { name: "Enrolled Students", icon: CheckSquare ,href:"/main/underdevelopment"},
            { name: "Student Interaction History", icon: Book ,href:"/main/underdevelopment"},
            { name: "Class Scheduling", icon: Calendar ,href:"/main/underdevelopment"},
            { name: "Parent-Teacher Communication", icon: MessageSquare ,href:"/main/underdevelopment"},
            { name: "Student Groups", icon: Users ,href:"/main/underdevelopment"},
            { name: "Behavior Reports", icon: AlertTriangle ,href:"/main/underdevelopment"},
            { name: "Health Records", icon: FileText ,href:"/main/underdevelopment"},
            { name: "Emergency Contacts", icon: Phone ,href:"/main/underdevelopment"},
        ],
    }, 
    {
        id: "2",
        title: "Branchs",
        icon: MapPinHouse,
        submenu: [
            { name: "All Branch", icon: MapPinHouse,href:"/main/page/branch" },
            { name: "New Branch", icon: MapPinPlus,href:"/main/page/addbranch" },
            { name: "Register Staff", icon: ShieldCheck,href:"/main/page/registerstaff" },
            { name: "Staff", icon: Users,href:"/main/page/staff" },
            { name: "Branch Reports", icon: Download,href:"/main/page/branchreport" },
            { name: "Branch Performance", icon: Gauge,href:"/main/page/performance" }
        ],
    },
    {
        id: "5",
        title: "Communication",
        icon: Mail,
        submenu: [
            { name: "Email Communication", icon: Mail,href:"/main/underdevelopment" },
        ],
    },
];
