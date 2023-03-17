export async function getMedia(
  constraints: MediaStreamConstraints
): Promise<[MediaStream | null, string | null]> {
  let error: string | null = null;
  let userMedia: MediaStream | null = null;
  try {
    userMedia = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (e: unknown) {
    if (e instanceof DOMException) {
      switch (e.name) {
        case "NotAllowedError":
          error = "Access to media device denied!";
          break;
        case "NotFoundError":
          error = "Media device not found!";
          break;
        case "NotReadableError":
          error = "Media device not readable!";
          break;
        default:
          error = "Error ocurred!";
          console.error("Error name: " + e.name + ", msg: " + e.message);
          break;
      }
    } else {
      console.log("Unknown error: " + e);
      error = "Unknown error ocurred!";
    }
  }

  return [userMedia, error];
}
