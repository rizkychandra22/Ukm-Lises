import { describe, it, expect } from "vitest";
import { normalizeMember } from "../lib/api/member";

describe("Member Normalizers", () => {
  describe("normalizeMember", () => {
    it("should normalize raw member with full fields", () => {
      const raw = {
        id: 5,
        name: "John Doe",
        type: "Pengurus",
        status: "Active",
        periode: "2023 - 2024",
        position_id: "Ketua",
        position_en: "President",
        image: "https://cloudinary.com/pic.jpg",
        batch_id: 10,
        major_id: 1,
        batch: {
          id: 10,
          year: "2023",
          name_id: "Angkatan X",
          status: "Active",
        },
        major: {
          id: 1,
          degree: "S1",
          name_id: "Informatika",
          faculty_id: "FTIB",
        },
      };

      const member = normalizeMember(raw);
      expect(member.id).toBe(5);
      expect(member.name).toBe("John Doe");
      expect(member.type).toBe("Pengurus");
      expect(member.status).toBe("Active");
      expect(member.periode).toBe("2023 - 2024");
      expect(member.positionId).toBe("Ketua");
      expect(member.positionEn).toBe("President");
      expect(member.image).toBe("https://cloudinary.com/pic.jpg");
      expect(member.batch?.year).toBe(2023);
      expect(member.batch?.nameId).toBe("Angkatan X");
      expect(member.major?.nameId).toBe("Informatika");
      expect(member.major?.facultyId).toBe("FTIB");
    });

    it("should fallback to defaults when fields are missing or null", () => {
      const raw = {
        id: "9",
        name: null,
        type: "InvalidType",
        status: "Deactive",
        batch: {
          id: "12",
        },
        major: {
          id: "5",
        },
      };

      const member = normalizeMember(raw);
      expect(member.id).toBe(9);
      expect(member.name).toBe("Tanpa Nama");
      expect(member.type).toBe("Pengurus"); // Fallback in normalizeMember is 'Pengurus' unless 'Demisioner'
      expect(member.status).toBe("Deactive");
      expect(member.image).toBeUndefined();

      // Checking child fallbacks
      expect(member.batch?.year).toBe(0);
      expect(member.batch?.nameId).toBe("-");
      expect(member.major?.nameId).toBe("-");
      expect(member.major?.facultyId).toBe("-");
    });
  });
});
