import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Presence, PresenceFlag } from "@/types/types";

/* =========================
   FONT REGISTER (UNICODE)
========================= */
Font.register({
  family: "DejaVu",
  src: "/fonts/DejaVuSans.ttf", // 👉 public/fonts/DejaVuSans.ttf
});

/* =========================
   TYPES
========================= */
type Props = {
  userName: string;
  monthLabel: string;
  presences: Presence[];
};

/* =========================
   CONSTANTS
========================= */
const FLAGS: PresenceFlag[] = [
  "PRESENT",
  "EXCEPTIONAL",
  "VALID",
  "ABSENT",
  "LATE",
  "FIELD",
  "EXCUSED",
  "ON_LEAVE",
];

const flagLabel: Record<PresenceFlag, string> = {
  PRESENT: "Présent",
  EXCEPTIONAL: "Exceptionnel",
  VALID: "Validé",
  ABSENT: "Absent",
  LATE: "Retard",
  FIELD: "Terrain",
  EXCUSED: "Excusé",
  ON_LEAVE: "Congé",
};

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "DejaVu",
    backgroundColor: "#ffffff",
  },

  /* HEADER */
  header: {
    backgroundColor: "#c97700",
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "white",
    textAlign: "center",
    marginBottom: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
  },

  /* TABLE */
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  row: {
    flexDirection: "row",
  },

  /* HEADER CELLS */
  cellHeader: {
    backgroundColor: "#0e8fa9",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderColor: "#d1d5db",
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 9,
  },

  /* BODY CELLS */
  cell: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },

  dateCell: {
    flex: 1.4,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 10,
  },

  totalRow: {
    backgroundColor: "#f3f4f6",
  },

  totalCell: {
    fontWeight: "bold",
  },
});

/* =========================
   COMPONENT
========================= */
export default function PresencePDF({
  userName,
  monthLabel,
  presences,
}: Props) {
  /* ===== STATS ===== */
  const stats = FLAGS.reduce((acc, f) => {
    acc[f] = 0;
    return acc;
  }, {} as Record<PresenceFlag, number>);

  presences.forEach((p) => {
    p.statut.forEach((s) => stats[s]++);
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.title}>{userName}</Text>
          <Text style={styles.subtitle}>
            État de présence — {monthLabel}
          </Text>
        </View>

        {/* ================= TABLE ================= */}
        <View style={styles.table}>
          {/* HEADER ROW */}
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Jour</Text>
            {FLAGS.map((f) => (
              <Text key={f} style={styles.cellHeader}>
                {flagLabel[f]}
              </Text>
            ))}
          </View>

          {/* DATA ROWS */}
          {presences.map((p) => {
            const d = new Date(p.date).toLocaleDateString("fr-FR");

            return (
              <View style={styles.row} key={p.id}>
                <Text style={styles.dateCell}>{d}</Text>

                {FLAGS.map((f) => (
                  <Text key={f} style={styles.cell}>
                    {p.statut.includes(f) ? "✔" : "✘"}
                  </Text>
                ))}
              </View>
            );
          })}

          {/* TOTAL ROW */}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.dateCell, styles.totalCell]}>
              Total
            </Text>

            {FLAGS.map((f) => (
              <Text key={f} style={[styles.cell, styles.totalCell]}>
                {stats[f]}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}