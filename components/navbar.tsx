import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "../components/ui/navigation-menu"
import { BookA, ScrollText, Brush, DollarSign, Euro, Castle, Earth, Landmark, Users, Zap, FlaskRound, Dna, Sigma, Brain } from "lucide-react"


const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-white border-b">
            <div className="flex items-center justify-between p-5">
                <div>
                    Logo
                </div>
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                <Link href={"/"}>
                                    Aprendizado
                                </Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="flex space-x-2 justify-between">
                                    <li className="w-44">
                                        <p className="p-1 text-sm font-semibold text-muted-foreground tracking-wide">
                                            Linguagens
                                        </p>
                                        <ul>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <BookA className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Português</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <ScrollText className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Literatura</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Brush className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Artes</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <DollarSign className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Inglês</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Euro className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Espanhol</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="w-44">
                                        <p className="p-1 text-sm font-semibold text-muted-foreground tracking-wide">
                                            Ciências Humanas
                                        </p>
                                        <ul>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Castle className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">História</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Earth className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Geografia</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Landmark className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Filosofia</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Users className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Sociologia</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="w-44">
                                        <p className="p-1 text-sm font-semibold text-muted-foreground tracking-wide">
                                            Ciências Naturais
                                        </p>
                                        <ul>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Zap className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Física</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <FlaskRound className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Química</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Dna className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Biologia</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="w-44">
                                        <p className="p-1 text-sm font-semibold text-muted-foreground tracking-wide">
                                            Matemática
                                        </p>
                                        <ul>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Sigma className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Cálculo Básico</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Brain className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Cálculo Mental</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Brain className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Cálculo Diferencial</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink>
                                                    <div className="flex space-x-2 items-center">
                                                        <Brain className="size-8 text-primary border-3 p-1 rounded-md" />
                                                        <span className="text-md font-medium">Cálculo Integral</span>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Desempenho</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink asChild>
                                    <Link href="/note">Conhecimento</Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink>Métricas</NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="/connection">Conexões</Link>
                                </NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Questões</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Filtro de Questões</NavigationMenuLink>
                                <NavigationMenuLink>Simulados</NavigationMenuLink>
                                <NavigationMenuLink>Lista de Questões</NavigationMenuLink>
                                <NavigationMenuLink>Lista Diagnóstico</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Ferramentas</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Flashcards</NavigationMenuLink>
                                <NavigationMenuLink>Calendário</NavigationMenuLink>
                                <NavigationMenuLink>Ranking</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Redação</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Correções</NavigationMenuLink>
                                <NavigationMenuLink>Temas de Redação</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink>
                                <p className=" font-medium">
                                    Aplicativos
                                </p>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div>
                    User
                </div>
            </div>
        </div>
    )
}

export default Navbar;