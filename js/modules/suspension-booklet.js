/*
  Suspension Booklet: students work on their suspension booklet by subject. They can use the online
  copy (when a subject has a "pdf"), a paper copy, or the booklet they were given when suspended,
  and type their answers here. The day certificate lists the subjects they started and finished.

  To add another year's booklet: split it into one PDF per subject in booklets/yearN/ (leave out
  any teacher answer sheets), then add it to "books" below.
*/
RP.registerModule({
  id: "suspension-booklet",
  title: "Suspension Booklet",
  icon: "📚",
  booklet: true,
  score: false,
  about: `Work on your suspension booklet. Choose a subject, then type your answers in the spaces. You can use the booklet on this laptop (if there's one for that subject), a paper copy, or the booklet from your suspension.

Your teacher will see which subjects you started and finished, and they'll be on your certificate at the end of the day.`,
  // One booklet per year. Students choose which one if there's more than one. Each subject's
  // pages are a separate PDF in booklets/ (split from the full booklet, without the teacher
  // answer sheets).
  books: [
    {
      id: "year7", title: "Year 7 booklet",
      subjects: [
        { id: "maths", title: "Maths", pdf: "booklets/year7/maths.pdf" },
        { id: "english", title: "English", pdf: "booklets/year7/english.pdf" },
        { id: "drama", title: "Drama", pdf: "booklets/year7/drama.pdf" },
        { id: "science", title: "Science", pdf: "booklets/year7/science.pdf" },
        { id: "history", title: "History", pdf: "booklets/year7/history.pdf" },
        { id: "geography", title: "Geography", pdf: "booklets/year7/geography.pdf" },
        { id: "pdhpe", title: "PDHPE", pdf: "booklets/year7/pdhpe.pdf" },
        { id: "tas", title: "TAS", pdf: "booklets/year7/tas.pdf" },
        { id: "riot", title: "RIOT", pdf: "booklets/year7/riot.pdf" },
        { id: "wellbeing", title: "Wellbeing", pdf: "booklets/year7/wellbeing.pdf" }
      ]
    }
  ]
});
