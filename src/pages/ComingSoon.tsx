import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
            <CardFooter>
              <Button variant="default">Try it Now</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link to="/4aces" className="block mt-4">
          <Card className="text-left hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-xl">4 Aces</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                A decision-making tool with five methods to help you choose with clarity. Flip a coin, weigh pros and cons, or align your choice with your values.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="default">Try it Now</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
