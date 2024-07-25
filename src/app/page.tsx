"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { LoaderCircle, MapPinIcon, Search } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

import { useEffect, useState } from "react";

interface RowsProps {
  title: string;
  link: string;
  seniority: string;
  locale: string;
  createdAt?: string;
}

export default function Home() {
  const [rows, setRows] = useState<RowsProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      setIsLoading(true);
      const { data } = await fetch("/api/jobs").then((res) => res.json());
      setRows(data);
    } catch (err) {
      toast({
        title: "Erro listagem",
        description: "Erro ao carregar listagem de vagas, tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArray = inputValue
    ? rows.filter(
        (row) =>
          row.title.toLowerCase().includes(inputValue.toLowerCase()) ||
          row.seniority.toLowerCase().includes(inputValue.toLowerCase())
      )
    : rows;

  return (
    <div className="flex max-h-screen w-full overflow-hidden">
      <main className="flex-1 bg-muted p-6 md:p-8 h-screen">
        <div className="mb-6 flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Lista de vagas</h1>
          <div className="flex items-center gap-2 relative shadow-sm w-96">
            <Input
              className="w-full"
              placeholder="Pesquise a vaga pela posição ou senioridade..."
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
            <Search className="w-4 h-4 absolute right-3 top-3" />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-screen flex items-center justify-center backdrop-blur-sm z-10 absolute left-0 top-0">
            <LoaderCircle className="w-12 h-12 animate-spin" />
          </div>
        ) : (
          <>
            {filteredArray?.length === 0 && (
              <h1 className="text-2xl font-semibold text-center mt-20">
                Nenhuma vaga encontrada
              </h1>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[90%] overflow-y-auto">
              {filteredArray?.map((r, i) => {
                return (
                  <Card key={i} className="h-[150px] shadow-md">
                    <CardHeader className="flex items-center justify-between flex-row">
                      <h3 className="text-lg font-semibold">
                        {r.title} {r.seniority ? `- ${r.seniority}` : ""}
                      </h3>

                      <Link href={r.link} target="_blank">
                        <Button variant="outline" size="sm">
                          Ver detalhe
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {r.locale}
                        </span>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
