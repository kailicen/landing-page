import { useBreakpointValue, Flex, IconButton, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { VscGraph } from "react-icons/vsc";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BsCalendarWeek } from "react-icons/bs";
import { User } from "firebase/auth";
import ShareProgressModal from "@/components/Modal/ShareProgress/ShareProgressModal";

type UserProgressMenuProps = {
  user?: User | null;
};

const UserProgressMenu: React.FC<UserProgressMenuProps> = ({ user }) => {
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const showStatistics = () => {
    router.push("/statistics");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Flex gap={1.5}>
        {isMobile ? (
          <IconButton
            aria-label="My Week"
            icon={<BsCalendarWeek />}
            onClick={() => router.push("/")}
            borderRadius="full"
            size="md"
            color="white"
          />
        ) : (
          <Button
            leftIcon={<BsCalendarWeek />}
            onClick={() => router.push("/")}
          >
            My Week
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="Export Progress"
            icon={<AiOutlineShareAlt />}
            onClick={openShareModal}
            borderRadius="full"
            size="md"
            color="white"
          />
        ) : (
          <Button leftIcon={<AiOutlineShareAlt />} onClick={openShareModal}>
            Share Progress
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="Weekly Statistics"
            icon={<VscGraph />}
            onClick={showStatistics}
            borderRadius="full"
            size="md"
          />
        ) : (
          <Button leftIcon={<VscGraph />} onClick={showStatistics}>
            Weekly Statistics
          </Button>
        )}
      </Flex>

      {/* Share Progress Modal */}
      <ShareProgressModal isOpen={isShareModalOpen} onClose={closeShareModal} />
    </>
  );
};

export default UserProgressMenu;
