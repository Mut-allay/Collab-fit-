import { Search } from "lucide-react";

export function VerificationHeader() {
    return (
        <div className="mb-6 text-center">
            <Search className="h-12 w-12 mx-auto text-spark-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">
                Firestore Data Verification
            </h1>
            <p className="text-muted-foreground">
                Check if the initial data seeding for exercises and workout programs was successful.
            </p>
        </div>
    );
}
