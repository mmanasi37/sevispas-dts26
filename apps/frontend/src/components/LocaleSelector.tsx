'use client';

import { Button } from "./ui/button";
import {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@/components/ui/button-group"
import { Globe } from "lucide-react";
import useLanguage from "@/hooks/use-language";

export default function LocaleSelector({ withIcon = false }: { withIcon?: boolean }) {
    const { setLanguage, language } = useLanguage();

    return (
        <ButtonGroup>
            <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
            >
                {withIcon && <Globe className="h-4 w-4 mr-1" />}
                English
            </Button>
            <Button
                variant={language === "tp" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("tp")}
            >
                {withIcon && <Globe className="h-4 w-4 mr-1" />}
                Tok Pisin
            </Button>
        </ButtonGroup>
    );
}