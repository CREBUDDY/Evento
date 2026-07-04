import LoaderBox from "@/components/loader-box";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brutalBg">
            {/* Wireframe Grid Background (to match the app) */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{
                   backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                   backgroundSize: '40px 40px'
                 }}>
            </div>
            
            <LoaderBox />
        </div>
    );
}
