import {
    Button,
    Center,
    Flex,
    FormControl, FormErrorMessage,
    FormLabel,
    Heading,
    Image,
    Input,
    Stack,
    VStack
} from "@chakra-ui/react";
import appLogo from '../../assets/logo.png'
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import publicApi from "../../config/api-client.ts";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {isAxiosError} from "axios";
import {useNavigate} from "react-router-dom";
const registerFormSchema = z
    .object({
        username: z.string().min(3,"Имя пользователя должно содержать минимум 3 символа"),
        password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
        confirmPassword: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerFormSchema>;

const RegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
    });


    const handleFormSubmit = async (credentials: RegisterFormData) => {
        setServerError(null);

        try {
            await publicApi.post("/api/accounts/register", {
                username: credentials.username,
                password: credentials.password,
            });

            navigate("/");

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setServerError("Пользователь с таким именем уже зарегистрирован");
                } else {
                    setServerError(err.response?.data?.detail || "Ошибка регистрации");
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
            <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Center backgroundColor="white" w="lg" shadow="lg" rounded='md'>
                <Stack pt="10" pb="10" spacing="2">

                    <Center>
                        <VStack>
                            <Image src={appLogo} />
                            <Heading fontSize="2xl">Регистрация</Heading>
                        </VStack>
                    </Center>

                    <FormControl isInvalid={!!errors.username || !!serverError}>
                        <FormLabel htmlFor="username">Имя пользователя</FormLabel>
                        <Input id="username" type="text" placeholder="Введите имя пользователя" {...register("username")} />
                        {serverError ? (
                            <FormErrorMessage>{serverError}</FormErrorMessage>
                        ) : (
                            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
                        )}

                    </FormControl>
                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel htmlFor="password">Пароль</FormLabel>
                        <Input id="password" type="password" placeholder="********" {...register("password")} />
                        <FormErrorMessage>
                            {errors.password?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel htmlFor="confirmPassword">Подтвердите пароль</FormLabel>
                        <Input id="confirmPassword" type="password" placeholder="********" {...register("confirmPassword")} />
                        <FormErrorMessage>
                            {errors.confirmPassword?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <Stack spacing="4" pt="2">
                        <Button
                            type="submit"
                            colorScheme="blue"
                        >
                            Зарегистрироваться
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                        >
                            Вернуться ко входу
                        </Button>
                    </Stack>

                </Stack>
            </Center>
            </form>
        </Flex>
    );
};

export default RegisterForm;