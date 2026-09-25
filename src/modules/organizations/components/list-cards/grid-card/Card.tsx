import { iconMap } from "@/utils";
import { Button, Card, Chip } from "@heroui/react";
import {
  ArrowRight01Icon,
  Call02Icon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ButtonManage } from "./ButtonManage";
import { IOrganization } from "@/modules/organizations";
import clsx from "clsx";

interface Props {
  organization: IOrganization;
}

export const CardOrganization = ({ organization }: Props) => {
  return (
    <Card className="group p-0 hover:shadow-2xl transition-all duration-300 flex flex-col h-full border-b-8 border-accent">
      <Card.Header className="relative h-48 overflow-hidden rounded-t-[inherit]">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          data-alt="A cinematic, high-action photograph of young athletes playing football on a lush green training pitch during a golden hour sunset. The lighting is warm and dramatic, highlighting the athletic movement and intensity. The visual style is professional sports photography with a clean, light-mode atmosphere, emphasizing the white and celeste colors of Club Atlético Nacional. The scene feels aspirational and disciplined."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEx1Y4941mKnNLam07K6qd3TVbSPp0cnWCnNmHLEsAfSWeceBsgKtPVkc3YvsW4OKa6wdLb_3tU1NN00FhC8Doyy-e3xBUh0r4Kt07p8IybZFlkQKeTXustrXR2hWCP-zCYJLU2SUGV4MsNdKtDrdT6NSuwUQzq_7nQ5ABaTev4pE2fmqfIvIIajvLN9-cNMsqYhmZ4EQPkwpNY1CMayLJ2YHcBnVwkblWG1fX8wYRQaJVW7TmiYBepIWVk6ZgVvG6O6Xcc5KKYeei"
        />
        {/* <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEx1Y4941mKnNLam07K6qd3TVbSPp0cnWCnNmHLEsAfSWeceBsgKtPVkc3YvsW4OKa6wdLb_3tU1NN00FhC8Doyy-e3xBUh0r4Kt07p8IybZFlkQKeTXustrXR2hWCP-zCYJLU2SUGV4MsNdKtDrdT6NSuwUQzq_7nQ5ABaTev4pE2fmqfIvIIajvLN9-cNMsqYhmZ4EQPkwpNY1CMayLJ2YHcBnVwkblWG1fX8wYRQaJVW7TmiYBepIWVk6ZgVvG6O6Xcc5KKYeei"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          quality={100}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        /> */}
        <div className="absolute top-4 left-4">
          <Chip variant="secondary" color={"success"}>
            <span className={clsx("w-2 h-2 rounded-full bg-success")}></span>
            <Chip.Label className="text-foreground">Activa</Chip.Label>
          </Chip>
        </div>
      </Card.Header>
      <Card.Content className="px-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Card.Title className="font-headline font-extrabold text-xl text-default-foreground leading-tight mb-1">
              {organization.name}
            </Card.Title>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} size={16} />
              <span className="text-xs font-medium">Sede Estadio - Pabell</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} size={16} />
              <span className="text-xs font-medium">admin@voleibolcan.com</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Call02Icon} size={16} />
              <span className="text-xs font-medium">+57 300 456 7890</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Programas
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md text-[10px] font-bold">
                VOLEIBOL COMPETITIVO
              </span>
            </div>
          </div>
        </div>
      </Card.Content>
      <Card.Footer className="p-4">
        <ButtonManage id={organization.id} text="Gestionar" />
      </Card.Footer>
    </Card>
  );
};
