import imageSizes from "./imageSizes.json";
import default_poster from "@/assets/default_poster.webp";

const baseImageUrl = "https://image.tmdb.org/t/p/";

type SizesDictionary = {
    [key: string]: string[];
};

export enum ImageType {
    BACKDROP = "backdrop",
    LOGO = "logo",
    POSTER = "poster",
    PROFILE = "profiel",
    STILL = "still",
}

export const getImageUrl = (
    type: ImageType,
    imagePath: string | undefined,
    imageSize: string = "original"
): string => {
    if (!imagePath) {
        //we only have a default image for poster, can add more later if needed.
        return type == ImageType.POSTER ? default_poster : "";
    }

    const image_sizes: SizesDictionary = imageSizes;
    const sizes: string[] = image_sizes[type];
    if (!sizes.includes(imageSize)) {
        console.error(
            `Invalid image size: ${imageSize}. The size is on the format "w<width>".`
        );
        return "";
    }
    return `${baseImageUrl}${imageSize}${imagePath}`;
};
