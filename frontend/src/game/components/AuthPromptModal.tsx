import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Link,
    Text
} from '@chakra-ui/react';

interface AuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Авторизация</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mb={5}>Войдите или зарегистрируйтесь, чтобы редактировать поле</Text>
                    <Link href="/">
                        <Button colorScheme="blue" width="100%" mb={2}>
                            Войти
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="outline" colorScheme="blue" width="100%">
                            Зарегистрироваться
                        </Button>
                    </Link>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Закрыть</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};