import { useMutation, useStorage } from "@/pages/liveblocks.config";
import { ActionIcon, Button, Group, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Text } from "@mantine/core";

export function Room({
  teamId,
  onLeaveRoom,
}: {
  teamId: string;
  onLeaveRoom: () => void;
}) {
  const teams = useStorage((root) => root.teams);

  useEffect(() => {
    if (!teams?.some((t) => t.id === teamId)) {
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

  return (
    <Table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {teams?.map((t) => (
          <tr key={t.id}>
            <td>
              <TeamName name={t.name} onDelete={() => removeTeam(t.id)} />
            </td>
            <td>{t.scores.reduce((acc, s) => acc + s.value, 0)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
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
