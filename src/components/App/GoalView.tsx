import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Center,
  Flex,
  Grid,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Spacer,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { MdAdd } from "react-icons/md";
import { useGoals } from "@/hooks/useGoals";
import moment from "moment";
import { Formik, Field, Form, FieldInputProps } from "formik";
import { CirclePicker } from "react-color";
import { ChevronDownIcon } from "@chakra-ui/icons";

type GoalViewProps = { user: User; startOfDay: string; startOfWeek: string };

function GoalView({ user, startOfDay, startOfWeek }: GoalViewProps) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [mobileStartOfWeek, setMobileStartOfWeek] = useState(startOfWeek);
  const toast = useToast();

  useEffect(() => {
    if (!isLargerThan768) {
      const startOfWeekMoment = moment(startOfDay).startOf("week");
      setMobileStartOfWeek(startOfWeekMoment.format("YYYY-MM-DD"));
    } else {
      setMobileStartOfWeek(startOfWeek);
    }
  }, [isLargerThan768, startOfDay, startOfWeek]);

  const {
    goals,
    newGoal,
    setNewGoal,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  } = useGoals(user, isLargerThan768 ? startOfWeek : mobileStartOfWeek);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalText, setSelectedGoalText] = useState("");
  const [selectedGoalCompleted, setSelectedGoalCompleted] = useState(false);
  const [selectedGoalDescription, setSelectedGoalDescription] = useState("");
  const [selectedGoalColor, setSelectedGoalColor] = useState("");

  const openDrawer = (
    id?: string,
    text?: string,
    completed?: boolean,
    description?: string,
    color?: string
  ) => {
    onOpen();
    setSelectedGoalId(id || null);
    setSelectedGoalText(text || "");
    setSelectedGoalCompleted(completed || false);
    setSelectedGoalDescription(description || "");
    setSelectedGoalColor(color || "");
  };

  const handleFormSubmit = (values: {
    goal: string;
    description: string;
    color: string;
  }) => {
    setNewGoal(values.goal); // set new goal value
    if (selectedGoalId) {
      handleUpdateGoal(
        selectedGoalId,
        values.goal,
        values.description,
        values.color
      );
    } else if (newGoal) {
      handleAddGoal(values.description, values.color);
    }
    onClose();
    setSelectedGoalId(null);
    setSelectedGoalText("");
  };

  const handleDelete = (id: string) => {
    handleDeleteGoal(id);
    toast({
      title: "Goal deleted.",
      description: "Your goal has been deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Center>
      <Box width="100%" p={4}>
        <Text mb={2} fontWeight="semibold">
          Sprint Goals:{" "}
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={3}>
          {goals.map((goal) => (
            <Flex
              key={goal.id}
              px={4}
              py={2}
              align="center"
              shadow="sm"
              borderWidth="1px"
              borderRadius="md"
              _hover={{ shadow: "md" }}
              cursor="pointer"
              bg={goal.color}
              onClick={() =>
                openDrawer(
                  goal.id,
                  goal.text,
                  goal.completed,
                  goal.description,
                  goal.color
                )
              }
            >
              <Text fontSize="sm" flexGrow={1}>
                {goal.text}
              </Text>
              {goal.completed && (
                <Badge colorScheme="green" ml="1" h="5">
                  Completed
                </Badge>
              )}
            </Flex>
          ))}
          <Flex align="center">
            <Icon
              as={MdAdd}
              color="gray.400"
              fontSize={26}
              cursor="pointer"
              onClick={() => openDrawer()}
            />
          </Flex>
        </Grid>
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedGoalId ? "Edit Goal" : "Create New Goal"}
            </DrawerHeader>
            <DrawerBody>
              <Formik
                initialValues={{
                  goal: selectedGoalText,
                  description: selectedGoalDescription,
                  color: selectedGoalColor,
                }}
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      name="goal"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Input {...field} placeholder="New goal..." />
                      )}
                    />
                    <Field
                      name="description"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Textarea
                          {...field}
                          placeholder="Description..."
                          mt={4}
                        />
                      )}
                    />

                    <Field name="color">
                      {({
                        field,
                        form,
                      }: {
                        field: FieldInputProps<any>;
                        form: any;
                      }) => (
                        <Box mt={4}>
                          <Menu>
                            <MenuButton
                              as={Button}
                              rightIcon={<ChevronDownIcon />}
                              size="sm"
                              colorScheme="transparent"
                              variant="outline"
                              borderColor="gray.300"
                            >
                              <Box
                                w="20px"
                                h="20px"
                                borderRadius="4px"
                                bg={form.values.color || "#FFFFFF"}
                                mr="2"
                              />
                            </MenuButton>
                            <MenuList>
                              <MenuItem onSelect={() => {}}>
                                <CirclePicker
                                  color={form.values.color}
                                  onChangeComplete={(color) => {
                                    form.setFieldValue("color", color.hex);
                                    form.setFieldTouched("color", true);
                                  }}
                                  colors={[
                                    "#FFB6C1", // LightPink
                                    "#FFD700", // Gold
                                    "#FFA500", // Orange
                                    "#87CEFA", // LightSkyBlue
                                    "#6495ED", // CornflowerBlue
                                    "#3CB371", // MediumSeaGreen
                                    "#f4eec2", // GreenYellow
                                    "#ea8c87", // PaleVioletRed
                                    "#b795ec", // MediumOrchid
                                    "#f9fafa", // Peru
                                    "#D8BFD8", // Thistle
                                    "#20B2AA", // LightSeaGreen
                                  ]}
                                />
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Box>
                      )}
                    </Field>
                    {selectedGoalId && (
                      <FormControl display="flex" alignItems="center" mt={4}>
                        <FormLabel mb="0">Completed:</FormLabel>
                        <Switch
                          isChecked={selectedGoalCompleted}
                          onChange={() => {
                            handleCompleteGoal(selectedGoalId);
                            setSelectedGoalCompleted(!selectedGoalCompleted);
                          }}
                        />
                        <Spacer />
                      </FormControl>
                    )}
                    <Button
                      mt={4}
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      {selectedGoalId ? "Update" : "Create"}
                    </Button>
                    {selectedGoalId && (
                      <Button
                        mt={4}
                        ml={2}
                        onClick={() => handleDelete(selectedGoalId)}
                      >
                        Delete
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Center>
  );
}

export default GoalView;
