import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const RulesetsPage = () => {
  //TODO If user's role is admin, then Create Normatives shouldn't even appear
  return (
    <div>
      <div></div>

      <div className="flex items-center justify-around flex-col p-5">
        <h1 className="text-4xl font-bold">Rulesets</h1>

        <p>Here you can find all the rulesets available for you to audit.</p>
        <p>Click on the ruleset you want to audit and start your audit.</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/rulesets/create" className="cursor-pointer ">
            <Card
              className="
            hover:shadow-2xl
            
            transition-all duration-300 ease-in-out
            rounded-2xl shadow-lg "
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Create Ruleset
                </CardTitle>
                <hr className=" h-0.5 border-t-0 bg-neutral-300 dark:bg-white/10" />
              </CardHeader>
              <CardContent>
                <p>
                  You canm create a ruleset from scratch, add some criterions
                  and more!.
                </p>
              </CardContent>
            </Card>
          </Link>
          {/* Card 2 */}
          <Link href="/rulesets/create" className="">
            <Card
              className="hover:shadow-2xl transition-all duration-300 ease-in-out
            rounded-2xl shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Check for Normatives
                </CardTitle>
                <hr className=" h-0.5 border-t-0 bg-neutral-300 dark:bg-white/10" />
              </CardHeader>
              <CardContent>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Excepturi voluptates incidunt adipisci, debitis voluptate
                  nesciunt eaque corporis maxime! Numquam voluptatum saepe,
                  similique sint iure eveniet.
                </p>
                <p>Quidem repudiandae accusantium atque tempora.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RulesetsPage;
