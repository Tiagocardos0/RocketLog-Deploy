import { env } from "@/env";

import { app } from "@/app";

const PORT = env.PORT

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));   