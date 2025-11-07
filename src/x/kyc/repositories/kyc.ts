import { DBClient } from "../../../databases/postgres/schema";
import { userKyc, userKycDocuments, userKycProfiles, userBiometrics } from "../../../databases/postgres/schema/kyc/index";
import { eq, and } from "drizzle-orm";

export default class KycRepository {
  /// ✅ CREATE
  static async createKycDocuments(kycData: any) {
    try {
      const [newKyc] = await DBClient.insert(userKycDocuments)
        .values(kycData)
        .returning();
      return newKyc;
    } catch (error) {
      console.error("Error creating kyc document:", error);
      throw new Error("Failed to create KYC document");
    }
  }


  static async createBiometric(userId: string, selfieUrl: string) {
    try {
      const [newBiometric] = await DBClient.insert(userBiometrics)
        .values({
          userId, // ✅ sahi userId
          biometricDataReferences: { face: selfieUrl },
          provider: "INTERNAL",
          livenessScore: 0,
          qualityScore: 0,
          collectionMethod: "LIVE_CAPTURE",
          collectionLocation: "IN",
          consentVersion: "v1",
        })
        .returning();

      return newBiometric;
    } catch (error) {
      console.error("Error creating biometric record:", error);
      if (error instanceof Error) {
        throw new Error("Failed to create biometric record: " + error.message);
      } else {
        throw new Error("Failed to create biometric record");
      }
    }
  }

  static async updateSelfie(userId: string, selfieUrl: string) {
    try {
      // 1️⃣ Check if record exists
      const [existing] = await DBClient.select().from(userBiometrics).where(eq(userBiometrics.userId, userId));

      if (!existing) {
        throw new Error("Biometric record not found");
      }

      // 2️⃣ Update only the face field
      const [updated] = await DBClient.update(userBiometrics)
        .set({
          biometricDataReferences: {
            ...existing.biometricDataReferences,
            face: selfieUrl,
          },
          updatedAt: new Date(),
        })
        .where(eq(userBiometrics.userId, userId))
        .returning();

      return updated;
    } catch (error: any) {
      console.error("Error updating biometric record:", error);
      throw new Error(error.message || "Failed to update biometric record");
    }
  }

  static async createKycUser(kycData: any) {
    try {
      const [newKyc] = await DBClient.insert(userKyc)
        .values(kycData)
        .returning();
      return newKyc;
    } catch (error) {
      console.error("Error creating kycUser:", error);
      throw new Error("Failed to create kycUser");
    }
  }

  static async createKycUserProfile(kycData: any) {
    try {
      const [newKyc] = await DBClient.insert(userKycProfiles)
        .values(kycData)
        .returning();
      return newKyc;
    } catch (error) {
      console.error("Error creating kycUserProfile:", error);
      throw new Error("Failed to create kycUserProfile");
    }
  }


  static async findKycProfileByKycId(kycId: string) {
    try {
      const [profile] = await DBClient.select()
        .from(userKycProfiles)
        .where(eq(userKycProfiles.kycId, kycId))
        .limit(1);
      return profile;
    } catch (error) {
      console.error("Error finding KYC profile by kycId:", error);
      throw new Error("Failed to fetch KYC profile by kycId");
    }
  }

  // get document by kycId + type (to check existing record)
  static async findDocByKycIdAndType(
    kycId: string,
    type: typeof userKycDocuments.documentType["enumValues"][number]
  ) {
    const [doc] = await DBClient.select()
      .from(userKycDocuments)
      .where(
        and(
          eq(userKycDocuments.kycId, kycId),
          eq(userKycDocuments.documentType, type)
        )
      )
      .limit(1);
    return doc;
  }

  // update document using userId (auth se)
  static async updateKycDocumentByUserId(userId: string, data: any) {
    const kyc = await this.findKycByUserId(userId);
    if (!kyc) throw new Error("KYC record not found");

    const [updated] = await DBClient.update(userKycDocuments)
      .set({
        ...data,
        updatedAt: new Date(), // 👈 yeh add karo
      })
      .where(eq(userKycDocuments.kycId, kyc.id))
      .returning();

    return updated;
  }


  static async updateKycUserProfileByKycId(kycId: string, updateData: any) {
    try {
      const [updatedKyc] = await DBClient.update(userKycProfiles)
        .set({
          ...updateData,
          updatedAt: new Date(), // ✅ updated_at refresh
        })
        .where(eq(userKycProfiles.kycId, kycId))
        .returning();

      if (!updatedKyc) {
        throw new Error("KYC Profile not found or update failed");
      }

      return updatedKyc;
    } catch (error) {
      console.error("Error updating kycUserProfile by kycId:", error);
      throw new Error("Failed to update kycUserProfile by kycId");
    }
  }

  static async updateKycUser(id: string, updateData: any) {
    try {
      const [updatedKyc] = await DBClient.update(userKyc)
        .set({ ...updateData, updatedAt: new Date() }) // ✅ updated_at refresh
        .where(eq(userKyc.id, id))
        .returning();

      return updatedKyc;
    } catch (error) {
      console.error("Error updating kycUser:", error);
      throw new Error("Failed to update kycUser");
    }
  }


  /// ✅ READ ONE (by userId from userKyc)
  static async findKycByUserId(userId: string) {
    try {
      const [kyc] = await DBClient.select()
        .from(userKyc)
        .leftJoin(userKycDocuments, eq(userKycDocuments.kycId, userKyc.id))
        .leftJoin(userBiometrics, eq(userBiometrics.userId, userId))
        .where(eq(userKyc.userId, userId)).limit(1);
      if (!kyc) {
        return null; // or throw new Error("KYC not found for user")
      }

      return {
        ...kyc.user_kyc,
        kyc_doc: kyc.user_kyc_documents || null,
        kyc_biometrics: kyc.user_biometrics || null
      }
    } catch (error) {
      console.error("Error finding KYC by userId:", error);
      throw new Error("Failed to fetch KYC by userId");
    }
  }

  static async verifyUserKyc(targetUserId: string, verifierId: string) {
    const existingKyc = await DBClient.select()
      .from(userKyc)
      .where(eq(userKyc.userId, targetUserId))
      .limit(1);

    if (!existingKyc.length) {
      throw new Error("KYC record not found for target userKYC");
    }

    const [updated] = await DBClient.update(userKyc)
      .set({
        status: "APPROVED",       // mark as verified
        verifiedBy: verifierId,   // who verified it
        updatedAt: new Date(),
      })
      .where(eq(userKyc.userId, targetUserId))
      .returning();

    return updated;
  }

  static async verifyUserBiometrics(targetUserId: string, verifierId: string) {
    const existingKyc = await DBClient.select()
      .from(userBiometrics)
      .where(eq(userBiometrics.userId, targetUserId))
      .limit(1);

    if (!existingKyc.length) {
      throw new Error("KYC record not found for target userBiometrics");
    }

    const [updated] = await DBClient.update(userBiometrics)
      .set({
        status: "VERIFIED",       // mark as verified
        verifiedBy: verifierId,   // who verified it
        updatedAt: new Date(),
      })
      .where(eq(userBiometrics.userId, targetUserId))
      .returning();

    return updated;
  }

  static async verifyUserKycDoc(targetUserId: string, verifierId: string) {
    // 1️⃣ Pehle user ka KYC record fetch karo
    const [kycRecord] = await DBClient.select()
      .from(userKyc)
      .where(eq(userKyc.userId, targetUserId))
      .limit(1);

    if (!kycRecord) {
      throw new Error("KYC record not found for target user's documents");
    }

    // 2️⃣ Us KYC ID ke sab documents update karo
    const updatedDocs = await DBClient.update(userKycDocuments)
      .set({
        isVerified: true,
        updatedAt: new Date(),
        verificationDetails: { verifiedBy: verifierId, verifiedAt: new Date() } // optional
      })
      .where(eq(userKycDocuments.kycId, kycRecord.id))
      .returning();

    return updatedDocs; // ye array h, sab updated documents milenge
  }



  /// ✅ READ ONE (by id)
  static async readOne(id: string) {
    try {
      const [doc] = await DBClient.select()
        .from(userKycDocuments)
        .where(eq(userKycDocuments.id, id));
      return doc;
    } catch (error) {
      console.error("Error reading KYC document:", error);
      throw new Error("Failed to read KYC document");
    }
  }

  /// ✅ READ MANY (by kycId)
  static async readMany(kycId: string) {
    try {
      const docs = await DBClient.select()
        .from(userKycDocuments)
        .where(eq(userKycDocuments.kycId, kycId));
      return docs;
    } catch (error) {
      console.error("Error reading KYC documents:", error);
      throw new Error("Failed to fetch KYC documents");
    }
  }

  /// ✅ UPDATE (by id)
  static async update(
    id: string,
    updateData: Partial<typeof userKycDocuments.$inferInsert>
  ) {
    try {
      const [updatedDoc] = await DBClient.update(userKycDocuments)
        .set(updateData)
        .where(eq(userKycDocuments.id, id))
        .returning();
      return updatedDoc;
    } catch (error) {
      console.error("Error updating KYC document:", error);
      throw new Error("Failed to update KYC document");
    }
  }

  /// ✅ DELETE (by id)
  static async delete(id: string) {
    try {
      const [deletedDoc] = await DBClient.delete(userKycDocuments)
        .where(eq(userKycDocuments.id, id))
        .returning();
      return deletedDoc;
    } catch (error) {
      console.error("Error deleting KYC document:", error);
      throw new Error("Failed to delete KYC document");
    }
  }
}