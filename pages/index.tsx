import { Inter } from "next/font/google";
import {
  AppShell,
  Box,
  Button,
  Container,
  Header,
  Loader,
  TextInput,
  Title,
} from "@mantine/core";
import {
  RoomProvider,
  useMutation,
  useStorage,
} from "../components/liveblocks.config";
import { Room } from "@/components/Room";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LiveList } from "@liveblocks/client";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    setTeamId(window.localStorage.getItem("teamId"));
  }, []);

  const onLeaveRoom = useCallback(() => {
    setTeamId(null);
    window.localStorage.removeItem("teamId");
  }, []);

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
          <RoomProvider
            id="handFootScoring"
            initialPresence={{}}
            initialStorage={{ teams: new LiveList([]) }}
          >
            {teamId ? (
              <Room onLeaveRoom={onLeaveRoom} teamId={teamId} />
            ) : (
              <JoinGame
                onJoin={(v) => {
                  window.localStorage.setItem("teamId", v);
                  setTeamId(v);
                }}
              />
            )}
          </RoomProvider>
        </Container>
      </AppShell>
    </>
  );
}

function JoinGame({ onJoin }: { onJoin: (teamId: string) => void }) {
  const [teamName, setTeamName] = useState("");
  const teams = useStorage((root) => root.teams);

  const addTeam = useMutation(({ storage }, teamId, teamName) => {
    const mutableTeams = storage.get("teams");
    mutableTeams.push({
      id: teamId,
      name: teamName,
      scores: [],
    });
  }, []);

  return teams === null ? (
    <Loader />
  ) : (
    <>
      <Box
        sx={() => ({
          textAlign: "center",
        })}
        mt="xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const newTeamId = uuidv4();
            addTeam(newTeamId, teamName);
            onJoin(newTeamId);
          }}
        >
          <TextInput
            placeholder="Team name"
            label="Team name"
            withAsterisk
            mb="lg"
            size="lg"
            value={teamName}
            onChange={(e) => setTeamName(e.currentTarget.value)}
            required
          />

          <Button size="xl" type="submit">
            Join Game
          </Button>
        </form>
      </Box>
    </>
  );
}
