import { cn } from "@/lib/utils"

export default function Logo({ className }: { className?: string }) {
    return (
        <div className="flex items-center gap-2">
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black"
            >
                <path d="M9 3H7.43248C6.91129 3 6.40939 3.10429 5.95995 3.30391C5.51052 3.50353 5.12574 3.79251 4.83223 4.14645C4.53873 4.50038 4.34446 4.90895 4.26428 5.34458C4.1841 5.78021 4.22053 6.22938 4.37059 6.64998L6.43934 12L4.37059 17.35C4.22053 17.7706 4.1841 18.2198 4.26428 18.6554C4.34446 19.091 4.53873 19.4996 4.83223 19.8535C5.12574 20.2075 5.51052 20.4965 5.95995 20.6961C6.40939 20.8957 6.91129 21 7.43248 21H9" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/>
                <path d="M15 3H16.5675C17.0887 3 17.5906 3.10429 18.0401 3.30391C18.4895 3.50353 18.8743 3.79251 19.1678 4.14645C19.4613 4.50038 19.6555 4.90895 19.7357 5.34458C19.8159 5.78021 19.7795 6.22938 19.6294 6.64998L17.5607 12L19.6294 17.35C19.7795 17.7706 19.8159 18.2198 19.7357 18.6554C19.6555 19.091 19.4613 19.4996 19.1678 19.8535C18.8743 20.2075 18.4895 20.4965 18.0401 20.6961C17.5906 20.8957 17.0887 21 16.5675 21H15" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
            <span className={cn("font-headline text-3xl font-black uppercase tracking-tighter text-black mt-1", className)}>
                Evento
            </span>
        </div>
    )
}
