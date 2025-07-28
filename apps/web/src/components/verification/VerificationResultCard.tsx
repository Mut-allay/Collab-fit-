import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { VerificationResult } from "@/hooks/useDataVerification";

interface VerificationResultCardProps {
    result: VerificationResult;
}

export function VerificationResultCard({ result }: VerificationResultCardProps) {
    const { overall } = result;

    return (
        <Card className={overall ? "border-green-500" : "border-destructive"}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {overall ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                    )}
                    <span>{overall ? "Verification Successful!" : "Verification Failed"}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    {overall
                        ? "All required data has been seeded correctly to Firestore."
                        : "Some data is missing or incomplete. Please consider re-running the seeding script."}
                </p>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => window.location.reload()}>Re-run Verification</Button>
                    {!overall && (
                        <code className="block p-2 bg-muted rounded text-sm">pnpm run seed</code>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
