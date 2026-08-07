import { StatusEnum } from "../enums/status.enum";

export const STATUS_MAP = {
    [StatusEnum.TODO]: 1,
    [StatusEnum.IN_PROGRESS]: 2,
    [StatusEnum.IN_REVIEW]: 3,
    [StatusEnum.DONE]: 4
}
