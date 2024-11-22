import { Center, Heading } from "@chakra-ui/react";
import React from "react";

export function MyHeading({ children, ...rest }) {
  return (
    <Center>
      <Heading size={{ base: "xl", md: "3xl" }} mt={5} mb={10} {...rest}>
        {children}
      </Heading>
    </Center>
  );
}
