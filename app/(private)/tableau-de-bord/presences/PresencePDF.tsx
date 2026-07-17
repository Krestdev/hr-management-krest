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
  
  textSuccess: {
    color: "#059669",
  },

  textError: {
    color: "#ef4444",
  },
  
  textMuted: {
    color: "#6b7280",
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
    p.status.forEach((s) => stats[s]++);
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
            <Text style={[styles.cellHeader, { flex: 1.4 }]}>Jour</Text>
            <Text style={styles.cellHeader}>Arrivée</Text>
            <Text style={styles.cellHeader}>Départ</Text>
            {FLAGS.map((f) => (
              <Text key={f} style={styles.cellHeader}>
                {flagLabel[f]}
              </Text>
            ))}
          </View>

          {/* DATA ROWS */}
          {presences.map((p) => {
            const d = new Date(p.checkIn).toLocaleDateString("fr-FR");

            let arrivalStr = "--:--";
            let arrivalStyle = styles.textMuted;
            if (p.checkIn) {
              const arrDate = new Date(p.checkIn);
              arrivalStr = arrDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
              const isLate = arrDate.getHours() > 8 || (arrDate.getHours() === 8 && arrDate.getMinutes() > 0);
              arrivalStyle = isLate ? styles.textError : styles.textSuccess;
            }

            let depStr = "--:--";
            let depStyle = styles.textMuted;
            if (p.checkOut) {
              const depDate = new Date(p.checkOut);
              depStr = depDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
              const isEarly = depDate.getHours() < 17;
              depStyle = isEarly ? styles.textError : styles.textSuccess;
            }

            return (
              <View style={styles.row} key={p.uuid}>
                <Text style={styles.dateCell}>{d}</Text>
                
                <Text style={[styles.cell, arrivalStyle, { fontWeight: "bold" }]}>{arrivalStr}</Text>
                <Text style={[styles.cell, depStyle, { fontWeight: "bold" }]}>{depStr}</Text>

                {FLAGS.map((f) => (
                  <Text key={f} style={[styles.cell, p.status.includes(f) ? styles.textSuccess : { color: "#ec4899" }]}>
                    {p.status.includes(f) ? "✔" : "✘"}
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
            
            <Text style={[styles.cell, styles.totalCell]}>-</Text>
            <Text style={[styles.cell, styles.totalCell]}>-</Text>

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