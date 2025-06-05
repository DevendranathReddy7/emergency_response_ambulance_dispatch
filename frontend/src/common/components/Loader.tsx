import { CircularProgress, Box, Typography } from "@mui/material";
import type { LoaderProps } from "../../dataModals/Common";
 
const Loader = ({
  size = 40,
  thickness = 4,
  fullScreen = false,
  msg,
}: LoaderProps)  => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height={fullScreen ? "100vh" : "100%"}
    width="100%"
    position={fullScreen ? "fixed" : "relative"}
    top={0}
    left={0}
    zIndex={fullScreen ? 1300 : "auto"}
    bgcolor={fullScreen ? "rgba(255, 255, 255, 0.8)" : "transparent"}
  >
    <CircularProgress size={size} thickness={thickness} />
    {msg && (
      <Typography variant="body2" mt={2}>
        {msg}
      </Typography>
    )}
  </Box>
);
 
export default Loader;