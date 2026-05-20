import { setDate} from 'date-fns';
import { Effect } from 'effect';

const encryptDate =(date: Date): Effect.Effect<Date, never,never> =>
Effect.succeed(setDate(date, 1));


export { encryptDate};