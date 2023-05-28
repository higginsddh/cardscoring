import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  AppShell,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Header,
  Input,
  Navbar,
  PinInput,
  TextInput,
  Title,
} from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <AppShell
        padding="md"
        header={
          <Header height={50} p="xs">
            <Title order={2}>Card Scoring</Title>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Container>
          <Box
            sx={(theme) => ({
              textAlign: "center",
            })}
          >
            <Button size="xl" mt="xl" type="button">
              Start New Game
            </Button>

            <Title order={1} my="xl">
              OR
            </Title>

            <form>
              <TextInput
                placeholder="Team name"
                label="Team name"
                withAsterisk
                mb="lg"
              />

              <Group position="center" mb="lg">
                <Input.Wrapper label="Code" withAsterisk>
                  <PinInput length={6} />
                </Input.Wrapper>
              </Group>

              <Button size="xl" type="submit">
                Join Game
              </Button>
            </form>
          </Box>
        </Container>
      </AppShell>
    </>
  );
}
