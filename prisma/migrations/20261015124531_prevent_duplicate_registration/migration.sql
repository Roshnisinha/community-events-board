/*
  Warnings:

  - A unique constraint covering the columns `[email,eventId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Registration_email_eventId_key" ON "Registration"("email", "eventId");
