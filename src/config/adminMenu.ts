// src/config/adminMenu.ts (atau sesuaikan dengan struktur folder Anda)
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  HeartHandshake, 
  ClipboardList, 
  Phone, 
  Mail 
} from 'lucide-react';

export const adminMenuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Program', path: '/admin/dashboard/program', icon: Calendar },
  { name: 'Artikel', path: '/admin/dashboard/artikel', icon: FileText },
  { name: 'Campaign Donasi', path: '/admin/dashboard/campaign', icon: HeartHandshake },
  { name: 'Data Donasi', path: '/admin/dashboard/data-donasi', icon: ClipboardList },
  { name: 'Testimoni', path: '/admin/dashboard/testimoni', icon: Phone },
  { name: 'Pesan', path: '/admin/dashboard/pesan', icon: Mail },
];