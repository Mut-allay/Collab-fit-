import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, type LucideIcon } from "lucide-react";
import type { Exercise, WorkoutProgram } from "@fitspark/shared";

interface VerificationDetailsCardProps {
    title: string;
    Icon: LucideIcon;
    count: number;
    success: boolean;
    expected: string;
    samples: (Exercise | WorkoutProgram)[];
}

export function VerificationDetailsCard({ title, Icon, count, success, expected, samples }: VerificationDetailsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {title} Collection
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4">
                    <strong>Count:</strong> {count}
                    {success ? (
                        <span className="text-green-600 flex items-center gap-1 text-sm"><CheckCircle className="h-4 w-4" /> OK</span>
                    ) : (
                        <span className="text-red-600 flex items-center gap-1 text-sm"><XCircle className="h-4 w-4" /> {expected}</span>
                    )}
                </div>

                {samples.length > 0 && (
                    <div>
                        <p className="font-medium mb-2 text-sm">Samples:</p>
                        <div className="space-y-2">
                            {samples.map((item) => (
                                <div key={item.id} className="p-2 bg-muted rounded text-sm">
                                    <p><strong>{'name' in item ? item.name : item.title}</strong></p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
