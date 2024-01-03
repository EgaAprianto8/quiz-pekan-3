import dynamic from "next/dynamic";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetcher from "../utils/fetcher";
import useSWR from "swr";
import { useMutation } from "@/hooks/useMutation";

const LayoutComponent = dynamic(() => import("@/layouts"));

export default function Home() {
  const { data, isLoading } = useSWR(
    "http://localhost:3000/api/notes",
    fetcher,
    { revalidateOnFocus: true }
  );
  const { mutate } = useMutation();
  const router = useRouter();
  const { id } = router.query;
  const [isError, setError] = useState(false);
  const [notes, setNotes] = useState({
    title: "",
    description: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const addModalInitialRef = React.useRef(null);
  const addModalFinalRef = React.useRef(null);

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const editModalInitialRef = React.useRef(null);
  const editModalFinalRef = React.useRef(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const HandleSubmit = async () => {
    try {
      setSubmitLoading(true);

      // Menggunakan data dari state lokal 'notes'
      const response = await mutate({
        url: "http://localhost:3000/api/notes/add",
        payload: notes,
      });

      console.log("response => ", response);

      setNotes({
        // Reset nilai state lokal setelah submit
        title: "",
        description: "",
      });

      setSubmitLoading(false);
    } catch (error) {
      // Handle error
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/notes/delete/${deleteItemId}`,
        {
          method: "POST",
        }
      );
      const result = await response.json();
      if (result?.success) {
        router.reload();
      }
    } catch (error) {}
  };

  const handleEdit = async () => {
    console.log('Sending PATCH request with payload:', notes);
    setSubmitLoading(true);
  
    try {
      const response = await fetch(`http://localhost:3000/api/notes/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(notes),
      });
      const result = await response.json();
      console.log('Response from server:', result);
  
      if (result?.success) {
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error('Error during PATCH request:', error);
      setSubmitLoading(false);
    }
  };
  
  
  

  const onEditModalOpenHandler = (item) => {
    if (item && item.id) {
      // Set nilai awal 'notes' berdasarkan data yang ingin diedit
      setNotes({
        title: item.title || "",
        description: item.description || "",
      });
      onEditModalOpen(); // Buka modal
    } else {
      console.error("Item or item.id is undefined");
    }
  };
  
  

  useEffect(() => {
    async function fetchingData(notesId) {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/notes/${notesId}`);
        const detailNotes = await response.json();
        setNotes({ 
          title: detailNotes?.data?.title,
          description: detailNotes?.data?.description,
        });
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  
    if (id) fetchingData(id);
  }, [id]);
  
  

  return (
    <>
      <LayoutComponent metaTitle="Notes" metaDescription="Quiz-Pekan-3">
        <Box padding="5" align="start">
          <Box align="end">
            <Button onClick={onAddModalOpen}>Add Notes</Button>
          </Box>

          <Flex justifyContent="center" p={4}>
            {isLoading && !isError ? (
              <Flex justifyContent="center" alignItems="center" height="60vh">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Flex>
                <Grid templateColumns="repeat(3, 1fr)" gap={5}>
                  {data?.data?.map((item) => (
                    <GridItem key={item.id}>
                      <Card>
                        <CardHeader>
                          <Heading>{item?.title}</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text>{item?.description}</Text>
                        </CardBody>
                        <CardFooter justify="space-between" flexWrap="wrap">
                        <Button
                          onClick={() => onEditModalOpenHandler(item)}
                          flex="1"
                          variant="ghost"
                          colorScheme="green"
                        >
                          Edit
                        </Button>
                          <Button
                            flex="1"
                            colorScheme="red"
                            onClick={() => {
                              setDeleteItemId(item.id); // Set ID item yang akan dihapus
                              onDeleteModalOpen();
                            }}
                          >
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    </GridItem>
                  ))}

                  {/* ADD NOTES MODAL */}
                  <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                      // Reset nilai state lokal saat modal ditutup
                      setNotes({
                        title: "",
                        description: "",
                      });
                      onAddModalClose();
                    }}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Add Notes</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <FormControl>
                          <FormLabel>Title Name</FormLabel>
                          <Input
                            onChange={(event) =>
                              setNotes({ ...notes, title: event.target.value })
                            }
                            value={notes.title} // Mengikat nilai input dengan state lokal
                            ref={addModalInitialRef}
                            placeholder="Title Name"
                          />
                        </FormControl>

                        <FormControl mt={4}>
                          <FormLabel>Description</FormLabel>
                          <Input
                            onChange={(event) =>
                              setNotes({
                                ...notes,
                                description: event.target.value,
                              })
                            }
                            value={notes.description} // Mengikat nilai input dengan state lokal
                            placeholder="Description"
                          />
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          isLoading={submitLoading}
                          onClick={() => HandleSubmit()}
                          colorScheme="blue"
                          mr={3}
                        >
                          Submit
                        </Button>
                        <Button onClick={onAddModalClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* EDIT NOTES MODAL */}
                  <Modal
                    initialFocusRef={editModalInitialRef}
                    finalFocusRef={editModalFinalRef}
                    isOpen={isEditModalOpen}
                    onClose={onEditModalClose}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Notes</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <FormControl>
                          <FormLabel>Title Name</FormLabel>
                          <Input
                            value={notes?.title}
                            type="text"
                            onChange={(event) =>
                              setNotes({ ...notes, title: event.target.value })
                            }
                          />
                        </FormControl>

                        <FormControl mt={4}>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            value={notes?.description}
                            onChange={(event) =>
                              setNotes({
                                ...notes,
                                description: event.target.value,
                              })
                            }
                          />
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          isLoading={submitLoading}
                          onClick={() => handleEdit()}
                          colorScheme="blue"
                          mr={3}
                        >
                          Submit
                        </Button>
                        <Button onClick={onEditModalClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* Delete Notes Modul (SELESAI) */}
                  <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                      setDeleteItemId(null); 
                      onDeleteModalClose();
                    }}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Delete Confirmation</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        Are you sure you want to delete this item?
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={onDeleteModalClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            handleDelete();
                            onDeleteModalClose();
                          }}
                        >
                          Delete
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Grid>
              </Flex>
            )}
            {isError && (
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            )}
          </Flex>
        </Box>
      </LayoutComponent>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
    const data = await res.json();
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
      },
    };
  }
}

