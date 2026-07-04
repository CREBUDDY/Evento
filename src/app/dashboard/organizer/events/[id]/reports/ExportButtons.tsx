'use client';

import { Button } from "@/components/ui/button";
import { Download, FileText, Table as TableIcon, FileSpreadsheet } from "lucide-react";
import { Event, Attendee, User } from "@prisma/client";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { unparse } from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FullEvent = Event & {
    attendees: (Attendee & { user: User })[];
    _count: { attendees: number };
};

export default function ExportButtons({ event }: { event: FullEvent }) {
    
    const generateData = () => {
        return event.attendees.map(a => ({
            Name: a.user.displayName,
            Email: a.user.email,
            Status: a.status.replace('_', ' ').toUpperCase(),
            RegisteredAt: format(new Date(a.createdAt), 'yyyy-MM-dd HH:mm'),
            TicketCode: a.verificationCode
        }));
    };

    const handleExportCSV = () => {
        const csv = unparse(generateData());
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Attendees.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(generateData());
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");
        
        // Revenue Sheet
        const revenueData = [
            { Metric: "Total Registrations", Value: event._count.attendees },
            { Metric: "Ticket Price", Value: event.price },
            { Metric: "Total Revenue", Value: event._count.attendees * event.price }
        ];
        const revenueSheet = XLSX.utils.json_to_sheet(revenueData);
        XLSX.utils.book_append_sheet(workbook, revenueSheet, "Revenue");

        XLSX.writeFile(workbook, `${event.title.replace(/\s+/g, '_')}_Report.xlsx`);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text(`Event Report: ${event.title}`, 14, 22);
        
        doc.setFontSize(11);
        doc.text(`Date: ${format(new Date(event.dateTime), "MMM d, yyyy")}`, 14, 30);
        doc.text(`Revenue: Rs ${event._count.attendees * event.price}`, 14, 36);
        doc.text(`Total Attendees: ${event._count.attendees}`, 14, 42);

        const tableColumn = ["Name", "Email", "Status", "Reg Date"];
        const tableRows = event.attendees.map(a => [
            a.user.displayName,
            a.user.email,
            a.status,
            format(new Date(a.createdAt), 'yyyy-MM-dd')
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0] }
        });

        doc.save(`${event.title.replace(/\s+/g, '_')}_Report.pdf`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={handleExportPDF} className="flex-1 h-14 rounded-none border-4 border-black bg-brutalRed text-black font-black uppercase hover:bg-brutalRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                <FileText className="mr-2 h-5 w-5" /> Download PDF
            </Button>
            <Button onClick={handleExportCSV} className="flex-1 h-14 rounded-none border-4 border-black bg-brutalGreen text-black font-black uppercase hover:bg-brutalGreen shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                <TableIcon className="mr-2 h-5 w-5" /> Export CSV
            </Button>
            <Button onClick={handleExportExcel} className="flex-1 h-14 rounded-none border-4 border-black bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                <FileSpreadsheet className="mr-2 h-5 w-5" /> Export Excel
            </Button>
        </div>
    );
}
