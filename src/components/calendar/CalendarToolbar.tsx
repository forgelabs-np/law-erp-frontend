import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NEPALI_FONT_STACK } from "../../utils/nepaliDateUtils";
import { CalendarView } from "./NepaliCalendar";

interface CalendarToolbarProps {
  /** Nepali (Bikram Sambat) title for the current calendar period, e.g. "श्रावण २०८३". */
  title: string;
  /** Optional secondary Gregorian label, e.g. "Jul–Aug 2026". */
  subtitle?: string;
  currentView: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
}

export const CalendarToolbar = ({
  title,
  subtitle,
  currentView,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: CalendarToolbarProps) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
      w="100%"
      mb={4}
      gap={4}
    >
      <Flex align="center" gap={4}>
        <Box minW="200px">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.800"
            _dark={{ color: "white" }}
            lineHeight="1.2"
            fontFamily={NEPALI_FONT_STACK}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              fontSize="sm"
              fontWeight="500"
              color="gray.500"
              _dark={{ color: "gray.400" }}
              lineHeight="1.2"
            >
              {subtitle}
            </Text>
          )}
        </Box>

        <Button
          variant="outline"
          size="sm"
          borderRadius="full"
          onClick={onToday}
          bg="white"
          _dark={{ bg: "gray.800", borderColor: "gray.600" }}
        >
          Today
        </Button>

        <ButtonGroup size="sm" attached variant="outline">
          <IconButton
            aria-label="Previous period"
            onClick={onPrev}
            borderRadius="full"
            borderRightRadius="none"
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          >
            <ChevronLeft size={16} />
          </IconButton>
          <IconButton
            aria-label="Next period"
            onClick={onNext}
            borderRadius="full"
            borderLeftRadius="none"
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          >
            <ChevronRight size={16} />
          </IconButton>
        </ButtonGroup>
      </Flex>

      <Flex align="center" gap={2}>
        <Text fontSize="sm" fontWeight="500" color="gray.600" mr={2}>
          View Full Calendar
        </Text>
        <ButtonGroup
          size="sm"
          attached
          variant="outline"
          bg="gray.100"
          _dark={{ bg: "gray.700" }}
          borderRadius="full"
          p={1}
        >
          <Button
            onClick={() => onViewChange("timeGridDay")}
            variant={currentView === "timeGridDay" ? "solid" : "ghost"}
            bg={currentView === "timeGridDay" ? "white" : "transparent"}
            color={currentView === "timeGridDay" ? "black" : "gray.500"}
            _dark={{
              bg: currentView === "timeGridDay" ? "gray.800" : "transparent",
              color: currentView === "timeGridDay" ? "white" : "gray.400",
            }}
            borderRadius="full"
            boxShadow={currentView === "timeGridDay" ? "sm" : "none"}
            _hover={{
              bg: currentView === "timeGridDay" ? "white" : "blackAlpha.100",
            }}
            fontWeight="500"
            px={4}
          >
            Day
          </Button>
          <Button
            onClick={() => onViewChange("timeGridWeek")}
            variant={currentView === "timeGridWeek" ? "solid" : "ghost"}
            bg={currentView === "timeGridWeek" ? "white" : "transparent"}
            color={currentView === "timeGridWeek" ? "black" : "gray.500"}
            _dark={{
              bg: currentView === "timeGridWeek" ? "gray.800" : "transparent",
              color: currentView === "timeGridWeek" ? "white" : "gray.400",
            }}
            borderRadius="full"
            boxShadow={currentView === "timeGridWeek" ? "sm" : "none"}
            _hover={{
              bg: currentView === "timeGridWeek" ? "white" : "blackAlpha.100",
            }}
            fontWeight="500"
            px={4}
          >
            Week
          </Button>
          <Button
            onClick={() => onViewChange("dayGridMonth")}
            variant={currentView === "dayGridMonth" ? "solid" : "ghost"}
            bg={currentView === "dayGridMonth" ? "white" : "transparent"}
            color={currentView === "dayGridMonth" ? "black" : "gray.500"}
            _dark={{
              bg: currentView === "dayGridMonth" ? "gray.800" : "transparent",
              color: currentView === "dayGridMonth" ? "white" : "gray.400",
            }}
            borderRadius="full"
            boxShadow={currentView === "dayGridMonth" ? "sm" : "none"}
            _hover={{
              bg: currentView === "dayGridMonth" ? "white" : "blackAlpha.100",
            }}
            fontWeight="500"
            px={4}
          >
            Month
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};
