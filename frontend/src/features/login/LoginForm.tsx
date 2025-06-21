import {
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading, Image,
    Input,
    Link,
    Stack,
    VStack
} from "@chakra-ui/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import publicApi from "../../config/api-client";
import { useNavigate } from "react-router-dom";
import appLogo from "../../assets/logo.png";
import {isAxiosError} from "axios";

const loginFormSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const LoginForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema)
    });

    const handleLogin = async (data: LoginFormData) => {
        setServerError(null);

        try {
            const response = await publicApi.post("/api/auth/login", data);
            localStorage.setItem("token", response.data);
            navigate("/game");
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setServerError("Неверное имя пользователя или пароль");
                } else {
                    setServerError("Ошибка входа");
                }
            } else if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError("Неизвестная ошибка");
            }
        }
    };

    return (
        <Flex>
            <form onSubmit={handleSubmit(handleLogin)} style={{ width: "100%" }}>
                <Center backgroundColor="white" w="lg" shadow="lg" rounded="md">
                    <Stack pt="10" pb="10" spacing="2" >
                        <Center>
                            <VStack>
                                <Image src={appLogo} />
                                <Heading fontSize="2xl">Вход</Heading>
                            </VStack>
                        </Center>

                        <FormControl isInvalid={!!errors.username || !!serverError}>
                            <FormLabel htmlFor="username">Имя пользователя</FormLabel>
                            <Input id="username" type="text" placeholder="Введите имя пользователя" {...register("username")}
                            />
                            <FormErrorMessage>
                                {errors.username?.message || serverError}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel htmlFor="password">Пароль</FormLabel>
                            <Input id="password" type="password" placeholder="********" {...register("password")}
                            />
                            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                        </FormControl>

                        <Button type="submit" colorScheme="blue" mt="4">
                            Войти
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/game")
                            }}
                            mt="2"
                        >
                            Войти как гость
                        </Button>

                        <Center mt="4">
                            <Link color="blue.400" onClick={() => navigate("/register")}>
                                У вас нет аккаунта?
                            </Link>
                        </Center>
                    </Stack>
                </Center>
            </form>
        </Flex>
    );
};