import {
  AppShell,
  Burger,
  Container,
  Group,
  NavLink,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./layout.module.css";
import { BsHouse } from "react-icons/bs";
import { Link } from "react-router";
import { useAtom } from "jotai";
import { CurrentTitleAtom, ExtraMenuItemsAtom } from "./atoms";
import { APP_VERSION } from "./settings";

type props = {
  children: React.ReactNode;
};

const LayoutComponent = ({ children }: props) => {
  const [opened, { toggle, close }] = useDisclosure();
  const [title] = useAtom(CurrentTitleAtom);
  const [menuItems] = useAtom(ExtraMenuItemsAtom);

  const handleClick = (callback: () => void) => {
    callback();
    close();
  };

  return (
    <AppShell
      header={{ height: 55.8 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      className={classes.appshell}
    >
      <AppShell.Header className={classes.header}>
        <Group p="sm">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3} style={{ margin: "auto" }}>
            {title}
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar} p="md">
        <NavLink
          component={Link}
          to={`/`}
          label="Start New Card"
          leftSection={<BsHouse />}
        />
        {menuItems.map((item) => (
          <NavLink
            key={item.text}
            component={UnstyledButton}
            onClick={() => handleClick(item.onClick)}
            label={item.text}
            leftSection={item.icon ?? <></>}
          />
        ))}
        <Container mt="auto">
          <Text size="xs" c="dark">
            BingoApp {APP_VERSION}
          </Text>
          <Text size="xs" c="dark">
            By Ethan Holman
          </Text>
        </Container>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default LayoutComponent;
