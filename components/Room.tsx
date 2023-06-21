import { Score, useMutation, useStorage } from "@/components/liveblocks.config";
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  NumberInput,
  Table,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Text } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

export function Room({
  teamId,
  onLeaveRoom,
}: {
  teamId: string;
  onLeaveRoom: () => void;
}) {
  const teams = useStorage((root) => root.teams);

  useEffect(() => {
    if (teams && !teams.some((t) => t.id === teamId)) {
      onLeaveRoom();
    }
  }, [teams, teamId, onLeaveRoom]);

  const removeTeam = useMutation(({ storage }, teamId) => {
    const mutableTeams = storage.get("teams");
    const index = mutableTeams.findIndex((t) => t.id === teamId);

    if (index !== -1) {
      mutableTeams.delete(index);
    }
  }, []);

  const team = teams?.find((t) => t.id === teamId);

  return (
    <>
      {teams === null ? <Loader /> : null}
      <Group position="apart">
        <Title order={3}>{team?.name}</Title>
        <FinishGame />
      </Group>
      <Table my="xl">
        <thead>
          <tr>
            <th>Team</th>
            <th style={{ textAlign: "right" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {teams?.map((t) => (
            <tr key={t.id}>
              <td>
                <TeamName name={t.name} onDelete={() => removeTeam(t.id)} />
              </td>
              <td style={{ textAlign: "right" }}>
                {t.scores.reduce((acc, s) => acc + s.value, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {team ? <Scores scores={team.scores} teamId={teamId} /> : null}
    </>
  );
}

function TeamName({ name, onDelete }: { name: string; onDelete: () => void }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Group spacing="xs">
        {name}
        <ActionIcon onClick={() => open()}>
          <IconTrash size={"1rem"} />
        </ActionIcon>
      </Group>
      <Modal opened={opened} onClose={close} title="Remove team">
        Are you sure you want to remove{" "}
        <Text span fw={700}>
          {name}
        </Text>
        ?
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              onDelete();
              close();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
}

function FinishGame({}: {}) {
  const finishGame = useMutation(({ storage }) => {
    const mutableTeams = storage.get("teams");
    mutableTeams.clear();
  }, []);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="red" onClick={open}>
        Finish Game
      </Button>
      <Modal opened={opened} onClose={close}>
        Are you sure you want to finish the game?
        <Text>All teams and scores will be removed.</Text>
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              finishGame();
              close();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
}

function Scores({ teamId, scores }: { teamId: string; scores: Array<Score> }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [score, setScore] = useState<number | "">("");
  const scoreRef = useRef<HTMLInputElement>(null);

  const addScore = useMutation(
    ({ storage }, value) => {
      const mutableTeams = storage.get("teams");
      const index = mutableTeams.findIndex((t) => t.id === teamId);

      if (index !== -1) {
        const currentTeam = mutableTeams.get(index);
        if (currentTeam) {
          currentTeam?.scores.push({
            id: uuidv4(),
            value,
          });
          mutableTeams.set(index, currentTeam);
        }
      }
    },
    [teamId]
  );

  const deleteScore = useMutation(
    ({ storage }, scoreId) => {
      const mutableTeams = storage.get("teams");
      const index = mutableTeams.findIndex((t) => t.id === teamId);

      if (index !== -1) {
        const currentTeam = mutableTeams.get(index);
        if (currentTeam) {
          currentTeam.scores = currentTeam.scores.filter(
            (s) => s.id !== scoreId
          );
          mutableTeams.set(index, currentTeam);
        }
      }
    },
    [teamId]
  );

  useEffect(() => {
    setTimeout(() => {
      if (opened && scoreRef.current) {
        scoreRef.current.focus();
      }
    }, 25);
  }, [opened]);

  return (
    <>
      <Group position="right">
        <Button
          onClick={() => {
            open();
            setScore("");
          }}
        >
          Add Points
        </Button>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s) => (
            <tr key={s.id}>
              <td style={{ textAlign: "right" }}>
                <ScoreValue
                  value={s.value}
                  deleteScore={() => deleteScore(s.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Add points">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addScore(score);
            close();
          }}
        >
          <NumberInput
            label="Score"
            required
            withAsterisk
            value={score}
            onChange={(v) => setScore(v)}
            ref={scoreRef}
          />

          <Group mt="md">
            <Button type="submit">Save</Button>
            <Button
              color="gray"
              type="button"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

function ScoreValue({
  value,
  deleteScore,
}: {
  value: number;
  deleteScore: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Group spacing="xs">
        {value}
        <ActionIcon onClick={() => open()}>
          <IconTrash size={"1rem"} />
        </ActionIcon>
      </Group>
      <Modal opened={opened} onClose={close} title="Remove score">
        Are you sure you want to remove the score{" "}
        <Text span fw={700}>
          {value}
        </Text>
        ?
        <Group mt="md">
          <Button
            color="red"
            onClick={() => {
              deleteScore();
              close();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
}
