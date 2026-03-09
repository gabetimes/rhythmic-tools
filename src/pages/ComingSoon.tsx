import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full text-center animate-fade-up">
        <h1 className="text-5xl font-serif font-semibold text-foreground tracking-tight">
          Useful Tools for Everyday Life
        </h1>

        <Link to="/ink" className="block mt-10">
          <Card className="text-left hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Ink</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                A minimalist digital companion for pen-and-paper journaling. Daily prompts, guided journeys, mood tracking, and ambient sounds to deepen your writing practice.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
